
import React, { useState, useRef, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';
import { ImageUtils } from '../../utils/imageUtils';
import download from 'downloadjs';

interface Props {
  tool: ToolDefinition;
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

export const ImageConverterTool: React.FC<Props> = ({ tool }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Specific prop to allow tool switching from this component if needed, 
  // though typically handled by parent. Included for consistency with other tools.
  const [onToolSelect, setOnToolSelect] = useState<((tool: ToolDefinition) => void) | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedFile(null);
    setPreview(null);
    setProcessing(false);
    setResultBlob(null);
  }, [tool.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResultBlob(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
             setSelectedFile(file);
             setPreview(URL.createObjectURL(file));
             setResultBlob(null);
        }
    }
  };

  const getTargetFormat = () => {
    if (tool.id.includes('to-jpg')) return 'image/jpeg';
    if (tool.id.includes('to-png')) return 'image/png';
    if (tool.id.includes('to-webp')) return 'image/webp';
    if (tool.id.includes('to-heic')) return 'image/heic';
    if (tool.id.includes('to-svg')) return 'image/svg+xml';
    if (tool.id.includes('to-avif')) return 'image/avif';
    if (tool.id.includes('to-gif')) return 'image/gif';
    if (tool.id.includes('to-tiff')) return 'image/tiff';
    if (tool.id.includes('to-vsd')) return 'application/vnd.visio';
    if (tool.id.includes('to-vsdx')) return 'application/vnd.ms-visio.drawing.main+xml';
    if (tool.id.includes('to-mp4')) return 'video/mp4';
    return 'image/png';
  };
  
  const getExtension = () => {
     if (tool.id.includes('to-jpg')) return 'jpg';
     if (tool.id.includes('to-png')) return 'png';
     if (tool.id.includes('to-webp')) return 'webp';
     if (tool.id.includes('to-heic')) return 'heic';
     if (tool.id.includes('to-svg')) return 'svg';
     if (tool.id.includes('to-avif')) return 'avif';
     if (tool.id.includes('to-gif')) return 'gif';
     if (tool.id.includes('to-tiff')) return 'tiff';
     if (tool.id.includes('to-vsdx')) return 'vsdx';
     if (tool.id.includes('to-vsd')) return 'vsd';
     if (tool.id.includes('to-mp4')) return 'mp4';
     return 'png';
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    
    try {
        const targetFormat = getTargetFormat();
        const blob = await ImageUtils.convertImage(selectedFile, targetFormat);
        setResultBlob(blob);
    } catch (e) {
        console.error(e);
        alert("Conversion failed.");
    } finally {
        setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
        download(resultBlob, `converted_image.${getExtension()}`, getTargetFormat());
    }
  };

  const getSEOContent = () => {
      const parts = tool.id.split('-to-');
      // Fallback if split fails (e.g. tool ID doesn't contain '-to-')
      const sourceExt = parts[0] ? parts[0].toUpperCase() : 'IMAGE';
      const targetExt = getExtension().toUpperCase();
      
      const baseKeywords = [
          `convert ${sourceExt} to ${targetExt}`,
          `${sourceExt} to ${targetExt} converter`,
          'image converter',
          'image editing tools',
          'online photo editor png', 
          'jpg file editor'
      ];

      if (targetExt === 'JPG' || targetExt === 'JPEG') {
          const jpgKeywords = [
              ...baseKeywords,
              'convert to jpg', 
              'save as jpeg', 
              'image format converter', 
              'change file type to jpg', 
              'jpg converter online', 
              'jpeg conversion', 
              'photo file converter',
              'free jpg tool',
              'transform image to jpg',
              'online image converter'
          ];
          return (
              <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Convert Images to JPG</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      JPG (or JPEG) is the most widely supported image format in the world. From older email clients to modern web browsers and smartphones, JPG files open everywhere. Converting your <strong>{sourceExt}</strong> files to JPG ensures that your images can be viewed by anyone, on any device, without compatibility issues. It functions as a universal <strong>image format converter</strong> that standardizes your visual content for broad accessibility.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      JPG uses "lossy" compression, which is excellent for photographs. It dramatically reduces file size by simplifying color data that the human eye struggles to see. This makes it the ideal format for sharing photos online or storing large albums. Use our <strong>jpg converter online</strong> to optimize your storage space while keeping your photos looking great. Whether you are converting from PNG, WEBP, or TIFF, our tool ensures a smooth transition to this standard format.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Our tool provides a quick and secure way to <strong>save as jpeg</strong>. Unlike desktop software, you don't need to install anything to <strong>change file type to jpg</strong>. Just upload, convert, and download your optimized images in seconds. This <strong>photo file converter</strong> is designed for speed and simplicity, making it the perfect <strong>free jpg tool</strong> for daily use.
                  </p>
                  <KeywordsBox keywords={jpgKeywords} />
              </>
          );
      } 
      else if (targetExt === 'PNG') {
          const pngKeywords = [
              ...baseKeywords,
              'convert to png', 
              'save as png', 
              'transparent background image', 
              'lossless image converter', 
              'png maker', 
              'high quality image format', 
              'change to png',
              'portable network graphics',
              'png conversion tool',
              'free png converter'
          ];
          return (
              <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Convert to High-Quality PNG</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Portable Network Graphics (PNG) is a "lossless" format, meaning it preserves every detail of your original image. Unlike JPG, PNG supports <strong>transparency</strong> (alpha channel), making it perfect for logos, icons, and graphics that need to be overlaid on other backgrounds. Use this tool to <strong>convert to png</strong> for crisp edges and clear text, ensuring your visuals look professional on any background.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      If you have a logo with a white background or a complex graphic, a <strong>png maker</strong> is essential. Converting from lossy formats to PNG stops further quality degradation. Our <strong>lossless image converter</strong> ensures that every pixel is retained exactly as it is, making it the preferred choice for designers and developers who need a <strong>high quality image format</strong>.
                  </p>
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-lg border border-gray-100 dark:border-slate-600 mb-4">
                      <h4 className="font-bold text-gray-800 dark:text-white mb-3">When to use PNG?</h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <li><strong>Screenshots:</strong> Keeps text sharp and readable.</li>
                          <li><strong>Logos:</strong> Essential for maintaining transparent backgrounds.</li>
                          <li><strong>Line Art:</strong> Prevents compression artifacts around sharp lines.</li>
                      </ul>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Need a reliable <strong>png conversion tool</strong>? Our platform handles the process locally in your browser. Safely <strong>save as png</strong> without uploading your sensitive designs to a cloud server. It's the ultimate <strong>free png converter</strong> for safeguarding your creative work.
                  </p>
                  <KeywordsBox keywords={pngKeywords} />
              </>
          );
      }
      else if (targetExt === 'WEBP') {
          const webpKeywords = [
              ...baseKeywords,
              'convert to webp', 
              'google webp converter', 
              'next gen image format', 
              'optimize images for speed', 
              'webp file converter', 
              'smaller image files', 
              'web performance',
              'webp maker',
              'compress image to webp',
              'fast image format'
          ];
          return (
              <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Modern WebP Conversion</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      WebP is a modern image format developed by Google that provides superior compression for images on the web. WebP lossless images are 26% smaller than PNGs, and WebP lossy images are 25-34% smaller than comparable JPEG images. Our <strong>webp file converter</strong> helps you leverage this technology instantly, reducing bandwidth usage and speeding up your website.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Using WebP can significantly improve your website's Core Web Vitals scores by reducing page load times. Search engines prioritize fast-loading sites, making WebP the preferred <strong>next gen image format</strong> for modern web development. Use this tool to <strong>optimize images for speed</strong> and boost your SEO ranking without sacrificing visual quality.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Whether you are a developer looking for a <strong>google webp converter</strong> or a blogger wanting <strong>smaller image files</strong>, this tool is for you. You can <strong>compress image to webp</strong> formats quickly and easily. It acts as a powerful <strong>webp maker</strong> that prepares your visual content for the modern web.
                  </p>
                  <KeywordsBox keywords={webpKeywords} />
              </>
          );
      }
      else if (targetExt === 'MP4') {
          const mp4Keywords = [
             ...baseKeywords,
             'convert gif to mp4',
             'video converter',
             'optimize gif',
             'animated image to video',
             'gif to video',
             'instagram gif support',
             'mp4 maker',
             'turn gif into video',
             'animation converter'
          ];
          return (
              <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Convert GIF to MP4 Video</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Convert your animated GIF files into efficient MP4 videos. MP4 files are widely supported, smaller in size, and allow for playback controls on modern web platforms and devices. This <strong>video converter</strong> functionality helps you save bandwidth on social media platforms like Instagram and TikTok that prefer video formats over large, inefficient GIF files.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      GIFs are ancient technology and often result in massive file sizes for short animations. By using our tool to <strong>convert gif to mp4</strong>, you can reduce the file size by up to 90% while maintaining high quality. This makes sharing your animations faster and smoother for your audience. It effectively works as an <strong>animated image to video</strong> transformer.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Need to upload an animation to a platform with <strong>instagram gif support</strong> limitations? Converting to MP4 is the solution. Our <strong>mp4 maker</strong> takes your frame-by-frame GIF and encodes it into a smooth video stream. Use this <strong>animation converter</strong> to <strong>turn gif into video</strong> content ready for any streaming platform.
                  </p>
                  <KeywordsBox keywords={mp4Keywords} />
              </>
          );
      }
      else if (sourceExt === 'HEIC' || targetExt === 'HEIC') {
          const heicKeywords = [
              ...baseKeywords,
              'heic converter', 
              'iphone photo converter', 
              'convert heic to jpg', 
              'open heic file', 
              'heic to png', 
              'apple image format', 
              'view iphone photos on pc',
              'heic to jpeg',
              'heic file viewer',
              'ios photo converter'
          ];
          return (
              <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">HEIC File Conversion</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      HEIC (High Efficiency Image Container) is the default image format for iPhones and iPads. While it offers excellent quality at half the size of a JPEG, it is not widely supported on Windows, older Macs, or Android devices. Our <strong>heic converter</strong> solves this compatibility gap, allowing you to share your mobile photos anywhere.
                  </p>
                  <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 p-6 rounded-xl mb-4">
                      <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-3">Why Convert HEIC?</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                          Converting HEIC to JPG makes your iPhone photos compatible with Windows PC, websites, and most photo editing software. Our tool handles this conversion instantly in your browser without uploading your private photos to a server. It allows you to <strong>view iphone photos on pc</strong> easily.
                      </p>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      You can <strong>convert heic to jpg</strong> or <strong>heic to png</strong> depending on your needs. This <strong>iphone photo converter</strong> is essential for backing up your library to non-Apple devices. Use this <strong>heic file viewer</strong> utility to ensure your memories are accessible on every platform. It is the ultimate <strong>ios photo converter</strong> for cross-platform compatibility.
                  </p>
                  <KeywordsBox keywords={heicKeywords} />
              </>
          );
      }
      else {
          return (
              <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Convert {sourceExt} to {targetExt}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Easily change your image format from <strong>{sourceExt}</strong> to <strong>{targetExt}</strong> directly in your browser. Whether you need better compatibility, transparency support, or smaller file sizes, our secure converter tool handles your files locally for maximum privacy and speed.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      This <strong>image converter</strong> supports a wide range of formats. By handling the conversion client-side, we ensure your data never leaves your device. It serves as a versatile <strong>photo converter</strong> and <strong>file format changer</strong> for all your digital asset needs.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Use this <strong>online image tool</strong> to prepare graphics for the web, print, or archival. Whether you need a <strong>picture converter</strong> for social media or a way to <strong>change image type</strong> for specific software, our tool delivers high-quality results instantly.
                  </p>
                  <KeywordsBox keywords={[...baseKeywords, 'photo converter', 'file format changer', 'online image tool', 'picture converter', 'change image type', 'convert photos online']} />
              </>
          );
      }
  };
  
  const getTargetExtLabel = () => {
      const parts = tool.id.split('-to-');
      if (parts.length > 1) return parts[1].toUpperCase();
      return getExtension().toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* 1. Upload State */}
      {!selectedFile && !resultBlob && (
         <div
           className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-slate-700' : 'border-blue-200 dark:border-slate-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
           onDragOver={handleDragOver}
           onDragLeave={handleDragLeave}
           onDrop={handleDrop}
           onClick={() => fileInputRef.current?.click()}
         >
           <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
           </div>
           <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">Upload Image</h3>
           <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Drag & drop or click to choose a file</p>
           <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm">
             Select File
           </button>
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
             accept="image/*" 
             className="hidden" 
            />
         </div>
      )}

      {/* 2. Process State */}
      {selectedFile && !resultBlob && (
         <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8 text-center animate-fadeIn">
             <div className="mb-6 relative inline-block">
                 {preview && <img src={preview} alt="Preview" className="h-48 object-contain rounded-lg border border-gray-200 dark:border-slate-600" />}
                 <button 
                    onClick={() => setSelectedFile(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                    title="Remove"
                 >
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
             </div>
             
             <div className="mb-8">
                 <p className="text-gray-600 dark:text-gray-300 font-medium">{selectedFile.name}</p>
                 <p className="text-sm text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
             </div>

             <button 
                 onClick={handleConvert}
                 disabled={processing}
                 className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
             >
                 {processing ? 'Converting...' : `Convert to ${getTargetExtLabel()}`}
             </button>
         </div>
      )}

      {/* 3. Result State */}
      {resultBlob && (
         <div className="bg-white dark:bg-slate-800 rounded-xl border border-green-200 dark:border-green-800 shadow-sm p-8 text-center animate-fadeIn">
             <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             </div>
             <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Conversion Complete!</h3>
             <p className="text-gray-600 dark:text-gray-400 mb-8">Your image is ready for download.</p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button 
                    onClick={handleDownload}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow hover:bg-green-700 transition flex items-center justify-center gap-2"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    Download Image
                 </button>
                 <button 
                    onClick={() => { setSelectedFile(null); setResultBlob(null); }}
                    className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                 >
                    Convert Another
                 </button>
             </div>
         </div>
      )}

      {/* NEW SEO CONTENT SECTION */}
      <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
         {getSEOContent()}
      </div>
    </div>
  );
};
