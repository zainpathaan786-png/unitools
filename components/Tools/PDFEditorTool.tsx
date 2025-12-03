
import React, { useState, useRef, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';
import { PdfUtils } from '../../utils/pdfUtils';
import { Toolbar } from './PDFEditor/Toolbar';
import { PageCanvas } from './PDFEditor/PageCanvas';
import { Annotation, EditorToolType } from './PDFEditor/types';
import { SignatureModal } from './PDFEditor/SignatureModal';
import download from 'downloadjs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface Props {
  tool: ToolDefinition;
  onBack?: () => void;
}

interface EditorPage {
    id: string;
    type: 'original' | 'blank';
    originalIndex: number; // 0-based index from source PDF
    thumbnail: string;
}

const KeywordsBox = ({ keywords }: { keywords: string[] }) => (
    <div className="mt-8 p-6 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl">
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Related Keywords</h4>
        <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
                <span key={i} className="text-xs font-medium bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-600">
                    {kw}
                </span>
            ))}
        </div>
    </div>
);

export const PDFEditorTool: React.FC<Props> = ({ tool, onBack }) => {
  // ... (No changes to logic, keeping existing state and functions) ...
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null); // PDFJS Document Proxy
  const [editorPages, setEditorPages] = useState<EditorPage[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [history, setHistory] = useState<{pages: EditorPage[], anns: Annotation[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Navigator State
  const [activePage, setActivePage] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Tool State
  const [currentTool, setCurrentTool] = useState<EditorToolType>(EditorToolType.SELECT);
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [opacity, setOpacity] = useState(1); // 0 to 1
  
  // Selection State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selWidth, setSelWidth] = useState<number | ''>('');
  const [selHeight, setSelHeight] = useState<number | ''>('');

  const [isSaving, setIsSaving] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  
  // PDF Viewing Scale
  const SCALE = 1.3; 

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Computed selected object type
  const selectedAnn = selectedId ? annotations.find(a => a.id === selectedId) : null;
  const selectedObjectType = selectedAnn ? selectedAnn.type : null;

  useEffect(() => {
      setFile(null);
      setPdfDoc(null);
      setAnnotations([]);
      setHistory([]);
      setHistoryIndex(-1);
      setEditorPages([]);
      setActivePage(1);
      pageRefs.current = [];
  }, [tool.id]);

  // Sync Toolbar state with Selected Item
  useEffect(() => {
      if (selectedAnn) {
          const ann = selectedAnn;
          // Sync Color
          if (ann.type === EditorToolType.HIGHLIGHT && (ann as any).fill) {
              setColor((ann as any).fill);
          } else if (ann.color && ann.color !== 'none') {
              setColor(ann.color);
          }
          
          // Sync Stroke/Font
          if (ann.strokeWidth !== undefined) setStrokeWidth(ann.strokeWidth);
          
          if (ann.type === EditorToolType.TEXT) {
              const txt = ann as any;
              setFontSize(txt.fontSize);
              setFontFamily(txt.fontFamily || 'Helvetica');
              setIsBold(txt.fontWeight === 'bold' || txt.fontWeight === 700);
              setIsItalic(txt.fontStyle === 'italic');
          }
          
          // Sync Opacity
          if (ann.opacity !== undefined) {
              setOpacity(ann.opacity);
          } else {
              setOpacity(ann.type === EditorToolType.HIGHLIGHT ? 0.4 : 1);
          }

          // Sync Dimensions
          if ('width' in ann) setSelWidth(Math.round((ann as any).width));
          if ('height' in ann) setSelHeight(Math.round((ann as any).height));
      } else {
          // Reset to defaults based on current tool
          if (currentTool === EditorToolType.HIGHLIGHT) {
              setOpacity(0.4);
              if (color === '#000000') setColor('#fde047');
          } else {
              setOpacity(1);
          }
          setSelWidth('');
          setSelHeight('');
      }
  }, [selectedId, annotations, currentTool]);

  const pushHistory = (newPages: EditorPage[], newAnnotations: Annotation[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ pages: newPages, anns: newAnnotations });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      setEditorPages(newPages);
      setAnnotations(newAnnotations);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const f = e.target.files[0];
          setFile(f);
          try {
              const { pdf } = await PdfUtils.loadPDF(f);
              setPdfDoc(pdf);
              
              // Generate thumbnails
              const thumbs = await PdfUtils.pdfToThumbnails(f);
              const initialPages: EditorPage[] = thumbs.map((thumb, idx) => ({
                  id: `page-${idx}-${Date.now()}`,
                  type: 'original',
                  originalIndex: idx,
                  thumbnail: thumb
              }));
              
              setEditorPages(initialPages);
              pushHistory(initialPages, []);
          } catch (err) {
              alert("Failed to load PDF");
          }
      }
  };

  // Intersection Observer
  useEffect(() => {
      if (!mainScrollRef.current || editorPages.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                  const index = Number(entry.target.getAttribute('data-page-index'));
                  setActivePage(index + 1);
              }
          });
      }, { 
          root: mainScrollRef.current,
          threshold: [0.3, 0.6] 
      });

      pageRefs.current.forEach(ref => {
          if (ref) observer.observe(ref);
      });

      return () => observer.disconnect();
  }, [editorPages.length]);

  const scrollToPage = (index: number) => {
      const element = pageRefs.current[index];
      if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActivePage(index + 1);
      }
  };

  const handleUndo = () => {
      if (historyIndex > 0) {
          const prev = history[historyIndex - 1];
          setHistoryIndex(historyIndex - 1);
          setEditorPages(prev.pages);
          setAnnotations(prev.anns);
      }
  };

  const handleRedo = () => {
      if (historyIndex < history.length - 1) {
          const next = history[historyIndex + 1];
          setHistoryIndex(historyIndex + 1);
          setEditorPages(next.pages);
          setAnnotations(next.anns);
      }
  };

  // -- Page Management --
  const handleAddPage = (insertIndex: number) => {
      const newPage: EditorPage = {
          id: `blank-${Date.now()}`,
          type: 'blank',
          originalIndex: -1,
          thumbnail: '' 
      };
      
      const newPages = [...editorPages];
      newPages.splice(insertIndex + 1, 0, newPage);
      
      const newAnns = annotations.map(a => {
          if (a.page > insertIndex + 1) {
              return { ...a, page: a.page + 1 };
          }
          return a;
      });

      pushHistory(newPages, newAnns);
      setTimeout(() => scrollToPage(insertIndex + 1), 100);
  };

  const handleDeletePage = (deleteIndex: number) => {
      if (editorPages.length <= 1) {
          alert("Cannot delete the last page.");
          return;
      }

      const newPages = editorPages.filter((_, idx) => idx !== deleteIndex);
      
      const newAnns = annotations
          .filter(a => a.page !== deleteIndex + 1)
          .map(a => {
              if (a.page > deleteIndex + 1) {
                  return { ...a, page: a.page - 1 };
              }
              return a;
          });

      pushHistory(newPages, newAnns);
  };

  // -- Drag and Drop Handlers --
  const onDragStart = (e: React.DragEvent, index: number) => {
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverIndex !== index) {
          setDragOverIndex(index);
      }
  };

  const onDragLeave = () => {
      setDragOverIndex(null);
  }

  const onDrop = (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      setDragOverIndex(null);
      if (draggedIndex === null || draggedIndex === dropIndex) return;

      const newPages = [...editorPages];
      const [movedPage] = newPages.splice(draggedIndex, 1);
      newPages.splice(dropIndex, 0, movedPage);

      const oldPageIdMap = editorPages.map(p => p.id);
      const newPageIdMap = new Map(newPages.map((p, i) => [p.id, i + 1]));

      const newAnns = annotations.map(ann => {
          const oldIndex = ann.page - 1;
          const pageId = oldPageIdMap[oldIndex];
          if (pageId && newPageIdMap.has(pageId)) {
              return { ...ann, page: newPageIdMap.get(pageId)! };
          }
          return ann;
      });

      pushHistory(newPages, newAnns);
      setDraggedIndex(null);
  };

  // -- Annotation Handlers --

  const handleColorChange = (newColor: string) => {
      setColor(newColor);
      if (selectedId) {
          const ann = annotations.find(a => a.id === selectedId);
          if (ann) {
              const updates: any = {};
              if (ann.type === EditorToolType.HIGHLIGHT) {
                  updates.fill = newColor;
              } else {
                  updates.color = newColor;
              }
              const newAnns = annotations.map(a => a.id === selectedId ? { ...a, ...updates } : a);
              pushHistory(editorPages, newAnns);
          }
      }
  };

  const handleOpacityChange = (newOpacity: number) => {
      setOpacity(newOpacity);
      if (selectedId) {
          const newAnns = annotations.map(a => a.id === selectedId ? { ...a, opacity: newOpacity } : a);
          setAnnotations(newAnns); 
      }
  };
  
  const commitOpacityChange = (newOpacity: number) => {
      if (selectedId) {
          const newAnns = annotations.map(a => a.id === selectedId ? { ...a, opacity: newOpacity } : a);
          pushHistory(editorPages, newAnns);
      }
  }

  const handleFontChange = (prop: 'family' | 'bold' | 'italic', value: any) => {
      if (prop === 'family') setFontFamily(value);
      if (prop === 'bold') setIsBold(value);
      if (prop === 'italic') setIsItalic(value);

      if (selectedId) {
          const ann = annotations.find(a => a.id === selectedId);
          if (ann && ann.type === EditorToolType.TEXT) {
              const updates: any = {};
              if (prop === 'family') updates.fontFamily = value;
              if (prop === 'bold') updates.fontWeight = value ? 'bold' : 'normal';
              if (prop === 'italic') updates.fontStyle = value ? 'italic' : 'normal';
              
              const newAnns = annotations.map(a => a.id === selectedId ? { ...a, ...updates } : a);
              pushHistory(editorPages, newAnns);
          }
      }
  };

  const handleDimensionChange = (prop: 'w' | 'h', value: number) => {
      if (prop === 'w') setSelWidth(value);
      if (prop === 'h') setSelHeight(value);

      if (selectedId) {
          const newAnns = annotations.map(a => {
              if (a.id === selectedId) {
                  const updates: any = {};
                  if (prop === 'w') updates.width = value;
                  if (prop === 'h') updates.height = value;
                  return { ...a, ...updates };
              }
              return a;
          });
          setAnnotations(newAnns); // smooth update
      }
  };

  const commitDimensionChange = () => {
      if (selectedId) {
          // Push current state to history
          pushHistory(editorPages, annotations);
      }
  };

  const addAnnotation = (ann: Annotation) => {
      if (ann.type === EditorToolType.CROP) {
          // Ensure only one CROP box per page
          const existingCrop = annotations.find(a => a.type === EditorToolType.CROP && a.page === ann.page);
          if (existingCrop) {
              const filtered = annotations.filter(a => a.id !== existingCrop.id);
              pushHistory(editorPages, [...filtered, ann]);
              return;
          }
      }
      pushHistory(editorPages, [...annotations, ann]);
  };

  const updateAnnotation = (ann: Annotation) => {
      const newAnns = annotations.map(a => a.id === ann.id ? ann : a);
      setAnnotations(newAnns);
      
      // Update local dimension state if resizing via handles
      if (ann.id === selectedId) {
          if ('width' in ann) setSelWidth(Math.round((ann as any).width));
          if ('height' in ann) setSelHeight(Math.round((ann as any).height));
      }
  };
  
  const commitAnnotationChange = (ann: Annotation) => {
      const newAnns = annotations.map(a => a.id === ann.id ? ann : a);
      pushHistory(editorPages, newAnns);
  };

  const handleDelete = () => {
      if (selectedId) {
          pushHistory(editorPages, annotations.filter(a => a.id !== selectedId));
          setSelectedId(null);
      }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const imgFile = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (ev) => {
              const data = ev.target?.result as string;
              const img = new Image();
              img.onload = () => {
                  const id = crypto.randomUUID();
                  const newAnn: Annotation = {
                      id, type: EditorToolType.IMAGE, page: activePage,
                      x: 50, y: 50,
                      width: 200, height: 200 * (img.height/img.width),
                      data, color: '', strokeWidth: 0,
                      mimeType: imgFile.type === 'image/png' ? 'image/png' : 'image/jpeg',
                      opacity: 1
                  };
                  addAnnotation(newAnn);
                  setCurrentTool(EditorToolType.SELECT);
                  setSelectedId(id);
              };
              img.src = data;
          };
          reader.readAsDataURL(imgFile);
      }
  };

  const handleSignatureSave = (dataUrl: string) => {
      const id = crypto.randomUUID();
      const img = new Image();
      img.onload = () => {
          // Default size for signature, maintain aspect
          const targetHeight = 60;
          const ratio = img.width / img.height;
          const targetWidth = targetHeight * ratio;
          
          const newAnn: Annotation = {
              id, type: EditorToolType.IMAGE, page: activePage,
              x: 100, y: 100, 
              width: targetWidth, height: targetHeight,
              data: dataUrl,
              mimeType: 'image/png',
              color: '', strokeWidth: 0, opacity: 1
          };
          addAnnotation(newAnn);
          setCurrentTool(EditorToolType.SELECT);
          setSelectedId(id);
      };
      img.src = dataUrl;
  };

  const handleApplyCrop = async () => {
      if (!selectedAnn || selectedAnn.type !== EditorToolType.CROP) return;
      
      const cropAnn = selectedAnn as any;
      setIsSaving(true);

      try {
          
          // We need to operate on the current PDF document
          let docToCrop;
          if (file) {
              const arrayBuffer = await file.arrayBuffer();
              const pdfDocLib = await PDFDocument.load(arrayBuffer);
              
              const currentPageConfig = editorPages[activePage - 1];
              
              if (currentPageConfig.type !== 'original') {
                  alert("Can only crop original pages.");
                  setIsSaving(false);
                  return;
              }

              const pageIndex = currentPageConfig.originalIndex;
              const page = pdfDocLib.getPage(pageIndex);
              const { height } = page.getSize();
              
              // Convert Editor Coordinates (Top-Left) to PDF Coordinates (Bottom-Left)
              const cropX = cropAnn.x / SCALE;
              const cropW = cropAnn.width / SCALE;
              const cropH = cropAnn.height / SCALE;
              const cropY = height - ((cropAnn.y + cropAnn.height) / SCALE);

              page.setCropBox(cropX, cropY, cropW, cropH);
              page.setMediaBox(cropX, cropY, cropW, cropH);
              
              // Save and Reload Editor
              const pdfBytes = await pdfDocLib.save();
              const newFile = new File([pdfBytes], file.name, { type: "application/pdf" });
              
              const shiftedAnnotations = annotations.filter(a => a.id !== selectedId).map(a => {
                  if (a.page === activePage) {
                      return {
                          ...a,
                          x: a.x - cropAnn.x,
                          y: a.y - cropAnn.y
                      };
                  }
                  return a;
              });

              // Reload Editor
              const { pdf } = await PdfUtils.loadPDF(newFile);
              setPdfDoc(pdf);
              setFile(newFile);
              
              // Regenerate Thumbnails
              const thumbs = await PdfUtils.pdfToThumbnails(newFile);
              
              const newEditorPages = thumbs.map((thumb, idx) => ({
                  id: `page-${idx}-${Date.now()}`,
                  type: 'original' as const,
                  originalIndex: idx,
                  thumbnail: thumb
              }));
              
              setEditorPages(newEditorPages);
              setAnnotations(shiftedAnnotations);
              setHistory([]); // Clear history to avoid state mismatch
              pushHistory(newEditorPages, shiftedAnnotations);
              setSelectedId(null);
              setCurrentTool(EditorToolType.SELECT);

          }
      } catch (e) {
          console.error(e);
          alert("Failed to crop page.");
      } finally {
          setIsSaving(false);
      }
  };

  const handleExport = async () => {
      setIsSaving(true);
      
      try {
          
          const newPdfDoc = await PDFDocument.create();
          
          // Embed Fonts
          const fonts: any = {
              'Helvetica': await newPdfDoc.embedFont(StandardFonts.Helvetica),
              'Helvetica-Bold': await newPdfDoc.embedFont(StandardFonts.HelveticaBold),
              'Helvetica-Oblique': await newPdfDoc.embedFont(StandardFonts.HelveticaOblique),
              'Helvetica-BoldOblique': await newPdfDoc.embedFont(StandardFonts.HelveticaBoldOblique),
              'Times': await newPdfDoc.embedFont(StandardFonts.TimesRoman),
              'Times-Bold': await newPdfDoc.embedFont(StandardFonts.TimesRomanBold),
              'Times-Italic': await newPdfDoc.embedFont(StandardFonts.TimesRomanItalic),
              'Times-BoldItalic': await newPdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic),
              'Courier': await newPdfDoc.embedFont(StandardFonts.Courier),
              'Courier-Bold': await newPdfDoc.embedFont(StandardFonts.CourierBold),
              'Courier-Oblique': await newPdfDoc.embedFont(StandardFonts.CourierOblique),
              'Courier-BoldOblique': await newPdfDoc.embedFont(StandardFonts.CourierBoldOblique),
          };
          
          let originalPdf = null;
          if (file) {
              const arrayBuffer = await file.arrayBuffer();
              originalPdf = await PDFDocument.load(arrayBuffer);
          }

          for (let i = 0; i < editorPages.length; i++) {
              const pConfig = editorPages[i];
              let page;

              if (pConfig.type === 'original' && originalPdf) {
                  const [copiedPage] = await newPdfDoc.copyPages(originalPdf, [pConfig.originalIndex]);
                  page = newPdfDoc.addPage(copiedPage);
              } else {
                  page = newPdfDoc.addPage([595.28, 841.89]);
              }

              const pageAnns = annotations.filter(a => a.page === i + 1 && a.type !== EditorToolType.CROP); // Exclude crop boxes
              const { height } = page.getSize();

              for (const ann of pageAnns) {
                  const x = ann.x / SCALE;
                  const y = height - (ann.y / SCALE);
                  
                  const parseColor = (hex: string) => {
                      if (!hex || hex === 'none') return undefined;
                      const r = parseInt(hex.slice(1, 3), 16) / 255;
                      const g = parseInt(hex.slice(3, 5), 16) / 255;
                      const b = parseInt(hex.slice(5, 7), 16) / 255;
                      return rgb(r, g, b);
                  };
                  
                  const colorRGB = parseColor(ann.color);
                  const op = ann.opacity !== undefined ? ann.opacity : 1;

                  if (ann.type === EditorToolType.TEXT) {
                      const txtAnn = ann as any;
                      const fSize = txtAnn.fontSize / SCALE;
                      
                      // Resolve Font Mapping for PDF Export
                      let fontBase = 'Helvetica'; // Default
                      const f = txtAnn.fontFamily || 'Helvetica';
                      
                      if (f.includes('Times') || f.includes('Georgia') || f.includes('Garamond')) fontBase = 'Times';
                      else if (f.includes('Courier') || f.includes('Mono')) fontBase = 'Courier';
                      else fontBase = 'Helvetica'; 
                      
                      const isB = txtAnn.fontWeight === 'bold' || txtAnn.fontWeight === 700;
                      const isI = txtAnn.fontStyle === 'italic';
                      
                      let suffix = '';
                      if (isB && isI) suffix = fontBase === 'Times' ? '-BoldItalic' : '-BoldOblique';
                      else if (isB) suffix = '-Bold';
                      else if (isI) suffix = fontBase === 'Times' ? '-Italic' : '-Oblique';
                      
                      let font = fonts[fontBase + suffix] || fonts[fontBase] || fonts['Helvetica'];

                      // Handle Background Fill (Whiteout)
                      if (txtAnn.backgroundColor) {
                          const bgCol = parseColor(txtAnn.backgroundColor);
                          if (bgCol) {
                              const textWidth = font.widthOfTextAtSize(txtAnn.text, fSize);
                              const textHeight = font.heightAtSize(fSize);
                              const padding = (txtAnn.padding || 2) / SCALE;
                              
                              page.drawRectangle({
                                  x: x - padding,
                                  y: y - fSize - padding, 
                                  width: textWidth + (padding * 2),
                                  height: textHeight + (padding * 2),
                                  color: bgCol,
                                  opacity: op
                              });
                          }
                      }

                      page.drawText(txtAnn.text, {
                          x, y: y - fSize, size: fSize, font: font, color: colorRGB,
                          opacity: op
                      });
                  } 
                  else if (ann.type === EditorToolType.RECTANGLE || ann.type === EditorToolType.HIGHLIGHT || ann.type === EditorToolType.EDIT_TEXT || ann.type === EditorToolType.ERASE_TEXT) {
                      const rectAnn = ann as any;
                      const w = rectAnn.width / SCALE;
                      const h = rectAnn.height / SCALE;
                      
                      const fillC = parseColor(rectAnn.fill);
                      
                      page.drawRectangle({
                          x, y: y - h, width: w, height: h,
                          borderColor: rectAnn.strokeWidth > 0 ? colorRGB : undefined,
                          borderWidth: rectAnn.strokeWidth / SCALE,
                          color: fillC, 
                          opacity: op
                      });
                  }
                  else if (ann.type === EditorToolType.CIRCLE || ann.type === EditorToolType.DOT) {
                      const circAnn = ann as any;
                      const w = circAnn.width / SCALE;
                      const h = circAnn.height / SCALE;
                      page.drawEllipse({
                          x: x + w/2, y: y - h/2, xScale: w/2, yScale: h/2,
                          borderColor: colorRGB, borderWidth: circAnn.strokeWidth / SCALE,
                          color: ann.type === EditorToolType.DOT ? colorRGB : undefined,
                          opacity: op
                      });
                  }
                  else if (ann.type === EditorToolType.LINE) {
                      const lineAnn = ann as any;
                      const x2 = lineAnn.x2 / SCALE;
                      const y2 = height - (lineAnn.y2 / SCALE);
                      page.drawLine({
                          start: { x, y }, end: { x: x2, y: y2 },
                          thickness: lineAnn.strokeWidth / SCALE, color: colorRGB,
                          opacity: op
                      });
                  }
                  else if (ann.type === EditorToolType.CHECK || ann.type === EditorToolType.CROSS) {
                      const shapeAnn = ann as any;
                      const w = shapeAnn.width / SCALE;
                      const h = shapeAnn.height / SCALE;
                      if (ann.type === EditorToolType.CHECK) {
                          page.drawLine({ start: { x: x + (w * 0.1), y: y - (h * 0.5) }, end: { x: x + (w * 0.4), y: y - (h * 0.9) }, thickness: 3 / SCALE, color: colorRGB, opacity: op });
                          page.drawLine({ start: { x: x + (w * 0.4), y: y - (h * 0.9) }, end: { x: x + (w * 0.9), y: y - (h * 0.1) }, thickness: 3 / SCALE, color: colorRGB, opacity: op });
                      } else {
                          page.drawLine({ start: { x: x + (w * 0.1), y: y - (h * 0.1) }, end: { x: x + (w * 0.9), y: y - (h * 0.9) }, thickness: 3 / SCALE, color: colorRGB, opacity: op });
                          page.drawLine({ start: { x: x + (w * 0.1), y: y - (h * 0.9) }, end: { x: x + (w * 0.9), y: y - (h * 0.1) }, thickness: 3 / SCALE, color: colorRGB, opacity: op });
                      }
                  }
                  else if (ann.type === EditorToolType.IMAGE) {
                      const imgAnn = ann as any;
                      const w = imgAnn.width / SCALE;
                      const h = imgAnn.height / SCALE;
                      let embeddedImage;
                      if (imgAnn.mimeType === 'image/png') embeddedImage = await newPdfDoc.embedPng(imgAnn.data);
                      else embeddedImage = await newPdfDoc.embedJpg(imgAnn.data);
                      page.drawImage(embeddedImage, { x, y: y - h, width: w, height: h, opacity: op });
                  } 
                  else if (ann.type === EditorToolType.PEN) {
                      const pts = (ann as any).points;
                      if (pts.length > 2) {
                          const path = [];
                          path.push(`M ${pts[0]/SCALE} ${height - (pts[1]/SCALE)}`);
                          for(let k=2; k<pts.length; k+=2) {
                              path.push(`L ${pts[k]/SCALE} ${height - (pts[k+1]/SCALE)}`);
                          }
                          page.drawSvgPath(path.join(' '), { borderColor: colorRGB, borderWidth: ann.strokeWidth / SCALE, opacity: op });
                      }
                  }
              }
          }

          const pdfBytes = await newPdfDoc.save();
          download(pdfBytes, "edited_document.pdf", "application/pdf");

      } catch (e) {
          console.error(e);
          alert("Failed to save PDF.");
      } finally {
          setIsSaving(false);
      }
  };

  const getSEOContent = () => {
    if (tool.id === ToolID.ESIGN_PDF) {
        return (
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Free Online PDF Signer</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    In today's digital world, the ability to quickly and securely sign documents is essential. Our <strong>online document signer</strong> allows you to create and add <strong>electronic signatures</strong> to your PDF files instantly. Whether you are finalizing a contract, approving an agreement, or filling out a form, our <strong>sign pdf online free</strong> tool simplifies the process. You can draw your signature, upload an image of it, or type it out to generate a professional look.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Security is a top priority for us. Your files are processed locally in your browser, meaning your sensitive documents never leave your device. This ensures maximum privacy when you <strong>sign documents online</strong>. Add a legally binding <strong>digital signature</strong> without the need for printers or scanners. Our intuitive interface makes it easy to <strong>add signature to pdf</strong> files, position it correctly, and save the document.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    This <strong>pdf signature tool</strong> is perfect for freelancers, business owners, and individuals who need a reliable <strong>free pdf signer</strong>. You can <strong>create electronic signature</strong> assets that look professional and trustworthy. Stop waiting for paper documents and switch to a streamlined digital workflow with our signing utility.
                </p>
                <KeywordsBox keywords={['esign pdf', 'electronic signature', 'sign pdf online', 'digital signature free', 'add signature to pdf', 'sign documents online', 'create electronic signature', 'pdf signature tool', 'online document signer', 'free pdf signer', 'sign pdf free', 'electronic document signing', 'pdf signer online']} />
            </>
        );
    } else {
        return (
            <>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Powerful PDF Editor Online</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Need to make quick changes to a PDF document but don't have expensive software? Our <strong>free pdf editor online</strong> is the perfect solution. You can <strong>annotate pdf</strong> files, add text boxes, insert shapes, and place images directly onto your document. Whether you need to <strong>modify pdf documents</strong> for work, school, or personal use, our tool provides a comprehensive set of features. It acts as a versatile <strong>pdf annotator</strong> that helps you highlight important information and leave comments.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Our editor includes advanced tools like a whiteout feature to erase unwanted text, a pen tool for freehand drawing, and stamps for quick marking. You can <strong>fill pdf forms</strong> effortlessly by adding text fields over existing lines. <strong>Edit pdf text and images</strong> without installing heavy applications like Adobe Acrobat. This <strong>online pdf filler</strong> is designed for speed and convenience, working on any device with a browser.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    From simple corrections to complex markups, our <strong>edit pdf document</strong> capabilities cover it all. You can <strong>change pdf text</strong> visually by covering old content and typing new text over it. It functions as the ultimate <strong>pdf drawing tool</strong> and lightweight <strong>pdf text editor</strong>. Experience the freedom of editing your PDFs securely and instantly.
                </p>
                <KeywordsBox keywords={['pdf editor online', 'edit pdf files', 'free pdf editor', 'modify pdf', 'add text to pdf', 'pdf annotator', 'online pdf filler', 'edit pdf document', 'pdf text editor', 'change pdf text', 'pdf drawing tool', 'fill pdf forms', 'annotate pdf online', 'pdf markup tool', 'edit pdf online free']} />
            </>
        );
    }
  };

  if (!file) {
      return (
        <div className="max-w-3xl mx-auto p-8">
            <div
                className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-16 text-center cursor-pointer hover:border-blue-400 transition group"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Upload PDF</h3>
                <p className="text-gray-500 mb-8 text-lg">Drag & Drop or Click to Start Editing</p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">Select PDF File</button>
                <input type="file" ref={fileInputRef} accept=".pdf" onChange={handleFileChange} className="hidden" />
            </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-[#e5e7eb] dark:bg-slate-900 transition-colors relative">
        <Toolbar 
            currentTool={currentTool} setTool={setCurrentTool}
            selectedObjectType={selectedObjectType}
            color={color} setColor={handleColorChange}
            strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth}
            fontSize={fontSize} setFontSize={setFontSize}
            fontFamily={fontFamily} setFontFamily={(f) => handleFontChange('family', f)}
            isBold={isBold} setBold={(b) => handleFontChange('bold', b)}
            isItalic={isItalic} setItalic={(i) => handleFontChange('italic', i)}
            opacity={opacity} setOpacity={handleOpacityChange} commitOpacity={commitOpacityChange}
            selWidth={selWidth} setSelWidth={(w) => handleDimensionChange('w', w)}
            selHeight={selHeight} setSelHeight={(h) => handleDimensionChange('h', h)}
            commitDimensions={commitDimensionChange}
            onUndo={handleUndo} onRedo={handleRedo} onDelete={handleDelete} onExport={handleExport} onImageUpload={handleImageUpload} onOpenSignature={() => setShowSignatureModal(true)} onApplyCrop={handleApplyCrop}
            onBack={onBack}
            hasSelected={!!selectedId}
            canUndo={historyIndex > 0} canRedo={historyIndex < history.length - 1}
            isSaving={isSaving}
        />
        
        {showSignatureModal && (
            <SignatureModal 
                onSave={handleSignatureSave}
                onClose={() => setShowSignatureModal(false)}
            />
        )}
        
        <div className="flex flex-1 overflow-hidden h-full">
            {/* Left Sidebar - Navigator (Desktop Only) */}
            <div className="hidden md:flex flex-col w-64 bg-gray-50 dark:bg-slate-800 border-r border-gray-300 dark:border-slate-700 overflow-hidden shadow-inner z-10 shrink-0">
                 <div className="p-4 border-b border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider flex justify-between items-center">
                     <span>Pages ({editorPages.length})</span>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                     {editorPages.map((page, idx) => (
                         <div 
                            key={page.id} 
                            className={`group relative p-2 rounded-lg transition-all duration-200 
                                ${activePage === idx + 1 ? 'bg-blue-100 dark:bg-slate-700 ring-2 ring-blue-500 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-slate-700 hover:shadow-sm'}
                                ${dragOverIndex === idx ? 'border-t-4 border-blue-600' : ''}
                                ${draggedIndex === idx ? 'opacity-50' : ''}
                            `}
                            draggable
                            onDragStart={(e) => onDragStart(e, idx)}
                            onDragOver={(e) => onDragOver(e, idx)}
                            onDragLeave={onDragLeave}
                            onDrop={(e) => onDrop(e, idx)}
                         >
                             <div 
                                onClick={() => scrollToPage(idx)}
                                className="relative aspect-[1/1.414] bg-white border border-gray-200 dark:border-slate-600 rounded overflow-hidden cursor-pointer"
                             >
                                 {page.type === 'original' && page.thumbnail ? (
                                     <img src={page.thumbnail} alt={`Page ${idx + 1}`} className="w-full h-full object-contain" />
                                 ) : (
                                     <div className="w-full h-full flex items-center justify-center bg-white">
                                         <span className="text-gray-300 text-xs">Blank Page</span>
                                     </div>
                                 )}
                             </div>
                             
                             <div className="flex items-center justify-between mt-2 px-1">
                                 <div className={`text-xs font-semibold transition-colors ${activePage === idx + 1 ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                     Page {idx + 1}
                                 </div>
                                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeletePage(idx); }}
                                        className="p-1 text-red-500 hover:bg-red-100 rounded" 
                                        title="Delete Page"
                                     >
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                     </button>
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); handleAddPage(idx); }}
                                        className="p-1 text-blue-500 hover:bg-blue-100 rounded" 
                                        title="Add Page Below"
                                     >
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                     </button>
                                 </div>
                             </div>
                         </div>
                     ))}
                     
                     {/* Add Page at End Button */}
                     <button 
                        onClick={() => handleAddPage(editorPages.length - 1)}
                        className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-sm font-medium"
                     >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                         Add Page
                     </button>
                 </div>
            </div>

            {/* Main Content */}
            <div 
                ref={mainScrollRef}
                className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-[#e5e7eb] dark:bg-slate-900 relative scroll-smooth pb-24 md:pb-8"
            >
                <div className="flex flex-col gap-8 items-center w-full max-w-6xl">
                    {editorPages.map((page, idx) => (
                        <div 
                            key={page.id} 
                            ref={el => { if(el) pageRefs.current[idx] = el; }}
                            data-page-index={idx}
                            className={`relative shadow-2xl bg-white w-full transition-shadow duration-300 ${activePage === idx + 1 ? 'ring-4 ring-blue-500/20' : ''}`}
                        >
                            <PageCanvas
                                pageNumber={idx + 1} // Viewer index (for annotation filtering)
                                originalPageNumber={page.type === 'original' ? page.originalIndex + 1 : null} // Source index (for pdf rendering)
                                pdfDoc={pdfDoc}
                                scale={SCALE}
                                rotation={0}
                                annotations={annotations}
                                currentTool={currentTool}
                                onAddAnnotation={addAnnotation}
                                onUpdateAnnotation={updateAnnotation}
                                onCommitAnnotation={commitAnnotationChange}
                                color={color}
                                strokeWidth={strokeWidth}
                                fontSize={fontSize}
                                fontFamily={fontFamily}
                                fontWeight={isBold ? 'bold' : 'normal'}
                                fontStyle={isItalic ? 'italic' : 'normal'}
                                opacity={opacity}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                            />
                            <div className="absolute top-2 -left-10 text-xs font-bold text-gray-500 bg-white/80 px-2 py-1 rounded shadow-sm hidden md:block">Page {idx + 1}</div>
                        </div>
                    ))}

                    <div className="w-full mt-16 prose dark:prose-invert bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                        {getSEOContent()}
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile Page Controls */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-slate-700 rounded-full px-4 py-2 flex items-center gap-4 z-50">
            <button onClick={() => scrollToPage(activePage - 2)} disabled={activePage <= 1} className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-bold text-gray-800 dark:text-white whitespace-nowrap">
                {activePage} / {editorPages.length}
            </span>
            <button onClick={() => scrollToPage(activePage)} disabled={activePage >= editorPages.length} className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    </div>
  );
};
