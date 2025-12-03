
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import PptxGenJS from 'pptxgenjs';
import * as XLSX from 'xlsx';

// Handle ES module import structure for pdfjs-dist
const pdfLibrary = (pdfjsLib as any).default || pdfjsLib;

// Helper: Convert image file to PNG bytes
const imageToPngBytes = async (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        blob.arrayBuffer().then(b => resolve(new Uint8Array(b)));
                    } else reject("Canvas blob error");
                }, 'image/png');
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Initialize worker with a Blob to avoid Cross-Origin "importScripts" errors
const initWorker = async () => {
  if (typeof window !== 'undefined' && pdfLibrary && pdfLibrary.GlobalWorkerOptions) {
    if (pdfLibrary.GlobalWorkerOptions.workerSrc) return;

    // Dynamically detect version if possible to match the library, otherwise fallback to known stable.
    const version = pdfLibrary.version || '3.11.174';
    const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
    
    try {
      const response = await fetch(workerUrl);
      if (!response.ok) throw new Error("Worker fetch failed");
      const scriptText = await response.text();
      const blob = new Blob([scriptText], { type: 'application/javascript' });
      pdfLibrary.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
    } catch (e) {
      console.error("Failed to load PDF worker:", e);
      // Fallback to CDN URL if blob fails (might cause CORS on some browsers)
      pdfLibrary.GlobalWorkerOptions.workerSrc = workerUrl;
    }
  }
};

export const PdfUtils = {
  /**
   * Load a PDF file into PDF.js Document Proxy
   */
  loadPDF: async (file: File) => {
    await initWorker();
    const arrayBuffer = await file.arrayBuffer();
    // Use Uint8Array to prevent issues with detached buffers in some environments
    const data = new Uint8Array(arrayBuffer);
    const loadingTask = pdfLibrary.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      pages.push(await pdf.getPage(i));
    }
    return { pdf, pages };
  },

  /**
   * Generate Thumbnails for Organizer Mode
   */
  pdfToThumbnails: async (file: File): Promise<string[]> => {
      await initWorker();
      const arrayBuffer = await file.arrayBuffer();
      // Use Uint8Array to ensure data integrity
      const data = new Uint8Array(arrayBuffer);
      const loadingTask = pdfLibrary.getDocument({ data });
      const pdf = await loadingTask.promise;
      
      const thumbnails: string[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.5 }); // Low scale for thumbnail
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({ canvasContext: context!, viewport }).promise;
          thumbnails.push(canvas.toDataURL());
      }
      return thumbnails;
  },

  /**
   * Merge multiple PDFs
   */
  mergePDFs: async (files: File[]): Promise<Uint8Array> => {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page: any) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
  },

  /**
   * Reassemble PDF (Split, Rotate, Reorder)
   */
  reassemblePDF: async (file: File, pagesConfig: { originalIndex: number, rotation: number }[]): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      for (const config of pagesConfig) {
          // Check if index is valid
          if (config.originalIndex >= 0 && config.originalIndex < originalPdf.getPageCount()) {
              const [copiedPage] = await newPdf.copyPages(originalPdf, [config.originalIndex]);
              const currentRotation = copiedPage.getRotation().angle;
              // Normalize rotation
              const newRotation = (currentRotation + config.rotation) % 360;
              copiedPage.setRotation(degrees(newRotation));
              newPdf.addPage(copiedPage);
          }
      }

      return await newPdf.save();
  },

  /**
   * Compress PDF (Rasterize to Images -> Rebuild)
   */
  compressPDF: async (file: File, quality: number = 0.7): Promise<Uint8Array> => {
      await initWorker();
      
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const pdf = await pdfLibrary.getDocument({ data }).promise;
      const newPdf = await PDFDocument.create();

      for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 }); // Reasonable quality scale
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context!, viewport }).promise;
          
          // Compress as JPEG
          const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
          const imgBytes = await fetch(imgDataUrl).then(res => res.arrayBuffer());
          
          const embeddedImage = await newPdf.embedJpg(imgBytes);
          const newPage = newPdf.addPage([viewport.width, viewport.height]);
          newPage.drawImage(embeddedImage, {
              x: 0,
              y: 0,
              width: viewport.width,
              height: viewport.height,
          });
      }

      return await newPdf.save();
  },

  /**
   * Protect PDF (Add Password)
   */
  protectPDF: async (file: File, password: string): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      // Load original
      const originalPdf = await PDFDocument.load(arrayBuffer);
      
      // Create new to ensure clean encryption state
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(originalPdf, originalPdf.getPageIndices());
      pages.forEach((p: any) => newPdf.addPage(p));

      // Encrypt
      (newPdf as any).encrypt({
          userPassword: password,
          ownerPassword: password,
          permissions: {
              printing: 'highResolution',
              modifying: false,
              copying: false,
              annotating: false,
              fillingForms: false,
              contentAccessibility: false,
              documentAssembly: false,
          },
      });

      return await newPdf.save();
  },

  /**
   * Unlock PDF (Remove Password)
   */
  unlockPDF: async (file: File, password?: string): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      // Loading with password decrypts it
      // Saving it writes it without encryption unless .encrypt is called
      try {
        const pdf = await PDFDocument.load(arrayBuffer, { password } as any);
        return await pdf.save();
      } catch (e) {
          throw new Error("Incorrect password or could not unlock.");
      }
  },

  /**
   * Repair PDF (Attempt to load and re-save)
   */
  repairPDF: async (file: File): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      // PDF-Lib's load method is quite robust and can often read files with minor structural errors
      // It ignores garbage at EOF, etc.
      // Saving it produces a clean compliant PDF structure.
      try {
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true }); 
        return await pdfDoc.save();
      } catch (e) {
          throw new Error("PDF is too severely corrupted to be repaired by this tool.");
      }
  },

  /**
   * Word to PDF (using Mammoth + PDF-Lib)
   */
  wordToPDF: async (file: File): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      
      // Extract raw text
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      // Basic text wrapping pagination
      const fontSize = 12;
      const margin = 50;
      const lineHeight = 14;
      
      // Split text into paragraphs
      const paragraphs = text.split('\n\n');
      
      let page = pdfDoc.addPage();
      let { width, height } = page.getSize();
      let y = height - margin;
      
      const drawWrappedText = (text: string) => {
          const maxWidth = width - (margin * 2);
          const words = text.split(' ');
          let line = '';
          
          for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + ' ';
              const testWidth = font.widthOfTextAtSize(testLine, fontSize);
              
              if (testWidth > maxWidth && n > 0) {
                  if (y < margin + lineHeight) {
                      page = pdfDoc.addPage();
                      y = height - margin;
                  }
                  page.drawText(line, { x: margin, y, size: fontSize, font });
                  line = words[n] + ' ';
                  y -= lineHeight;
              } else {
                  line = testLine;
              }
          }
          // Draw last line
          if (y < margin + lineHeight) {
              page = pdfDoc.addPage();
              y = height - margin;
          }
          page.drawText(line, { x: margin, y, size: fontSize, font });
          y -= (lineHeight * 1.5); // Paragraph spacing
      };

      for (const p of paragraphs) {
          drawWrappedText(p);
      }

      return await pdfDoc.save();
  },

  /**
   * PowerPoint to PDF (Basic Text Extraction)
   */
  powerPointToPDF: async (file: File): Promise<Uint8Array> => {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      // Find slides
      const slideFiles = Object.keys(content.files).filter(name => name.match(/ppt\/slides\/slide\d+\.xml/));
      
      // Sort slides naturally
      slideFiles.sort((a, b) => {
          const numA = parseInt(a.match(/slide(\d+)\.xml/)![1]);
          const numB = parseInt(b.match(/slide(\d+)\.xml/)![1]);
          return numA - numB;
      });

      for (const slideFile of slideFiles) {
          const xmlStr = await content.files[slideFile].async("string");
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
          
          // Extract text from <a:t> tags
          const textNodes = xmlDoc.getElementsByTagName("a:t");
          let slideText = "";
          for (let i = 0; i < textNodes.length; i++) {
              slideText += textNodes[i].textContent + "\n";
          }

          // Add page
          const page = pdfDoc.addPage();
          const { width, height } = page.getSize();
          const fontSize = 12;
          const margin = 50;
          
          page.drawText(`Slide ${slideFiles.indexOf(slideFile) + 1}`, {
              x: margin,
              y: height - margin,
              size: 14,
              font: font,
              color: rgb(0, 0, 1),
          });

          page.drawText(slideText || "(No text content found on this slide)", {
              x: margin,
              y: height - margin - 40,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
              maxWidth: width - (margin * 2),
              lineHeight: 16,
          });
      }

      return await pdfDoc.save();
  },

  /**
   * PDF to Text
   */
  pdfToText: async (file: File): Promise<string> => {
      await initWorker();
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const pdf = await pdfLibrary.getDocument({ data }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n\n";
      }
      return fullText;
  },

  /**
   * PDF to Images (JPG/PNG) - ZIP Download
   */
  pdfToImages: async (file: File, format: 'jpeg' | 'png'): Promise<Blob> => {
      await initWorker();
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const pdf = await pdfLibrary.getDocument({ data }).promise;
      const zip = new JSZip();

      for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // High res
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context!, viewport }).promise;
          
          const imgData = canvas.toDataURL(`image/${format}`).split(',')[1];
          zip.file(`page_${i}.${format === 'jpeg' ? 'jpg' : 'png'}`, imgData, { base64: true });
      }

      return await zip.generateAsync({ type: 'blob' });
  },

  /**
   * PDF to Excel
   */
  pdfToExcel: async (file: File): Promise<Blob> => {
      const text = await PdfUtils.pdfToText(file);
      const rows = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
          .map(line => line.split(/\s{2,}/)); // Split by 2 or more spaces

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      return new Blob([wbout], { type: 'application/octet-stream' });
  },

  /**
   * Excel to PDF
   */
  excelToPDF: async (file: File): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      
      // Parse Excel
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Get data as CSV/Text
      const csvData: string = XLSX.utils.sheet_to_csv(worksheet);
      
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Courier); // Courier for monospaced alignment
      
      const lines = csvData.split('\n');
      const fontSize = 10;
      const margin = 40;
      const lineHeight = 12;
      
      let page = pdfDoc.addPage();
      let { width, height } = page.getSize();
      let y = height - margin;

      for (const line of lines) {
          if (y < margin + lineHeight) {
              page = pdfDoc.addPage();
              y = height - margin;
          }
          const displayLine = line.replace(/,/g, '  |  '); 
          
          page.drawText(displayLine, {
              x: margin,
              y: y,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
              maxWidth: width - (margin * 2),
          });
          y -= lineHeight;
      }

      return await pdfDoc.save();
  },

  /**
   * PDF to PowerPoint
   */
  pdfToPowerPoint: async (file: File): Promise<Blob> => {
      await initWorker();
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const pdf = await pdfLibrary.getDocument({ data }).promise;
      
      const pptx = new PptxGenJS();

      for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 }); // Good balance
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context!, viewport }).promise;
          const imgData = canvas.toDataURL('image/png');

          const slide = pptx.addSlide();
          slide.addImage({ data: imgData, x: 0, y: 0, w: "100%", h: "100%" });
      }

      return new Promise((resolve) => {
          pptx.write("blob").then((blob: Blob) => {
              resolve(blob);
          });
      });
  },

  /**
   * PDF to ePub
   */
  pdfToEpub: async (file: File): Promise<Blob> => {
      const text = await PdfUtils.pdfToText(file);
      const zip = new JSZip();
      const title = file.name.replace('.pdf', '');
      
      // 1. mimetype
      zip.file("mimetype", "application/epub+zip");

      // 2. META-INF/container.xml
      zip.file("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

      // 3. OEBPS/content.opf
      zip.file("OEBPS/content.opf", `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${title}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="BookId" opf:scheme="UUID">urn:uuid:${Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="style" href="style.css" media-type="text/css"/>
    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="content"/>
  </spine>
</package>`);

      // 4. OEBPS/toc.ncx
      zip.file("OEBPS/toc.ncx", `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${Date.now()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${title}</text></docTitle>
  <navMap>
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel><text>Start</text></navLabel>
      <content src="content.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`);

      // 5. OEBPS/style.css
      zip.file("OEBPS/style.css", `body { font-family: serif; margin: 5%; text-align: justify; } p { margin-bottom: 1em; }`);

      // 6. OEBPS/content.xhtml (HTML Content)
      // Convert newlines to paragraphs
      const paragraphs = text.split('\n').filter(line => line.trim().length > 0).map(line => `<p>${line.trim()}</p>`).join('');
      
      zip.file("OEBPS/content.xhtml", `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <h1>${title}</h1>
  ${paragraphs}
</body>
</html>`);

      return await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
  },

  /**
   * Images to PDF
   */
  imagesToPDF: async (files: File[]): Promise<Uint8Array> => {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          let image;
          if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
              image = await pdfDoc.embedJpg(arrayBuffer);
          } else if (file.type === 'image/png') {
              image = await pdfDoc.embedPng(arrayBuffer);
          } else if (file.type === 'image/gif' || file.type === 'image/webp') {
              // Convert to PNG first
              try {
                  const pngBytes = await imageToPngBytes(file);
                  image = await pdfDoc.embedPng(pngBytes);
              } catch (e) {
                  console.error("Could not convert image", file.name, e);
                  continue;
              }
          } else {
              continue; 
          }

          const page = pdfDoc.addPage([image.width, image.height]);
          page.drawImage(image, {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
          });
      }

      return await pdfDoc.save();
  },

  /**
   * Add Page Numbers
   */
  addPageNumbers: async (file: File): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const { width } = page.getSize();
          page.drawText(`${i + 1} / ${pages.length}`, {
              x: width - 50,
              y: 20,
              size: 10,
              font: font,
              color: rgb(0, 0, 0),
          });
      }

      return await pdfDoc.save();
  },

  /**
   * Add Watermark
   * Position: 'top-left', 'top-center', 'top-right', 'center', 'bottom-left', 'bottom-center', 'bottom-right'
   */
  addWatermark: async (file: File, text: string, position: string = 'center', fontSize: number = 50, rotation: number = 45): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(text, fontSize);
          const textHeight = font.heightAtSize(fontSize);
          const margin = 20;

          let x = 0;
          let y = 0;

          // Basic positioning calculations
          switch (position) {
              case 'top-left':
                  x = margin;
                  y = height - margin - textHeight;
                  break;
              case 'top-center':
                  x = (width - textWidth) / 2;
                  y = height - margin - textHeight;
                  break;
              case 'top-right':
                  x = width - margin - textWidth;
                  y = height - margin - textHeight;
                  break;
              case 'center':
                  x = (width - textWidth) / 2;
                  y = (height - textHeight) / 2;
                  break;
              case 'bottom-left':
                  x = margin;
                  y = margin;
                  break;
              case 'bottom-center':
                  x = (width - textWidth) / 2;
                  y = margin;
                  break;
              case 'bottom-right':
                  x = width - margin - textWidth;
                  y = margin;
                  break;
              default:
                  // Center default
                  x = (width - textWidth) / 2;
                  y = (height - textHeight) / 2;
                  break;
          }
          
          page.drawText(text, {
              x: x,
              y: y,
              size: fontSize,
              font: font,
              color: rgb(0.8, 0.8, 0.8), // Light gray
              opacity: 0.5,
              rotate: degrees(rotation),
          });
      }
      return await pdfDoc.save();
  },

  /**
   * Crop PDF
   */
  cropPDF: async (file: File, cropRect: { x: number, y: number, width: number, height: number }): Promise<Uint8Array> => {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
          const { width, height } = page.getSize();
          
          // PDF coordinate system: origin is bottom-left
          // cropRect input: origin is top-left, values are 0-1 percentages
          
          const cropX = cropRect.x * width;
          const cropW = cropRect.width * width;
          const cropH = cropRect.height * height;
          
          // Calculate Y from bottom
          const cropY = height * (1 - (cropRect.y + cropRect.height));

          page.setCropBox(cropX, cropY, cropW, cropH);
          page.setMediaBox(cropX, cropY, cropW, cropH);
      }

      return await pdfDoc.save();
  },

  /**
   * EPUB to PDF
   * (Extracts text content and creates PDF)
   */
  epubToPDF: async (file: File): Promise<Uint8Array> => {
      const zip = new JSZip();
      const epub = await zip.loadAsync(file);
      
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const fontSize = 12;
      const margin = 50;
      const lineHeight = 16;

      let page = pdfDoc.addPage();
      let { width, height } = page.getSize();
      let y = height - margin;

      // Basic text drawing helper
      const drawText = (text: string) => {
          const maxWidth = width - (margin * 2);
          const words = text.split(' ');
          let line = '';
          
          for (const word of words) {
              const testLine = line + word + ' ';
              const testWidth = font.widthOfTextAtSize(testLine, fontSize);
              
              if (testWidth > maxWidth && line !== '') {
                  if (y < margin + lineHeight) {
                      page = pdfDoc.addPage();
                      y = height - margin;
                  }
                  page.drawText(line, { x: margin, y, size: fontSize, font });
                  line = word + ' ';
                  y -= lineHeight;
              } else {
                  line = testLine;
              }
          }
          if (line !== '') {
              if (y < margin + lineHeight) {
                  page = pdfDoc.addPage();
                  y = height - margin;
              }
              page.drawText(line, { x: margin, y, size: fontSize, font });
              y -= lineHeight * 1.5; // Paragraph spacing
          }
      };

      try {
          // Find rootfile in container
          const containerXml = await epub.file("META-INF/container.xml")?.async("string");
          if (!containerXml) throw new Error("Invalid EPUB");
          
          const parser = new DOMParser();
          const containerDoc = parser.parseFromString(containerXml, "text/xml");
          const rootPath = containerDoc.querySelector("rootfile")?.getAttribute("full-path");
          
          if (!rootPath) throw new Error("No rootfile found");
          
          const contentOpf = await epub.file(rootPath)?.async("string");
          if (!contentOpf) throw new Error("Content.opf not found");
          
          const opfDoc = parser.parseFromString(contentOpf, "text/xml");
          const manifest = opfDoc.getElementsByTagName("manifest")[0];
          const spine = opfDoc.getElementsByTagName("spine")[0];
          
          // Map ID to Href
          const idToHref: Record<string, string> = {};
          Array.from(manifest.children).forEach((item: any) => {
              idToHref[item.getAttribute("id")] = item.getAttribute("href");
          });

          // Process Spine
          const basePath = rootPath.includes('/') ? rootPath.substring(0, rootPath.lastIndexOf('/') + 1) : '';
          
          for (const itemRef of Array.from(spine.children)) {
              const id = (itemRef as Element).getAttribute("idref");
              if (id && idToHref[id]) {
                  const href = basePath + idToHref[id];
                  const fileContent = await epub.file(href)?.async("string");
                  
                  if (fileContent) {
                      const doc = parser.parseFromString(fileContent, "text/html");
                      const text = doc.body.textContent || "";
                      const cleanText = text.replace(/\s+/g, ' ').trim(); // Normalize whitespace
                      if(cleanText) drawText(cleanText);
                  }
              }
          }
      } catch (e) {
          console.error("EPUB Parsing error", e);
          drawText("Error parsing EPUB file. Text extraction failed.");
      }

      return await pdfDoc.save();
  }
};
