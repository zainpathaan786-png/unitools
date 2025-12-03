
import React, { useState, useRef, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';
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

export const Base64ImageTool: React.FC<Props> = ({ tool }) => {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [output, setOutput] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset state on tool change
    setFile(null);
    setTextInput('');
    setOutput('');
    setPreview(null);
    setCopySuccess(false);
  }, [tool.id]);

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
        processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
    }
  };

  const processFile = (f: File) => {
      if (!f.type.startsWith('image/')) {
          alert("Please select an image file.");
          return;
      }
      setFile(f);
      const reader = new FileReader();
      reader.onload = (e) => {
          const res = e.target?.result as string;
          setOutput(res);
          setPreview(res);
      };
      reader.readAsDataURL(f);
  };

  const handleDecode = () => {
      let base64 = textInput.trim();
      // Basic fix if user pasted just the raw base64 without data URI scheme
      if (!base64.startsWith('data:image/')) {
          // Try to detect/guess or just prepend generic png if unknown
          // But usually we need the mime type. Let's assume user pastes full data URI or we try to display it anyway.
          if (!base64.startsWith('data:')) {
             base64 = `data:image/png;base64,${base64}`;
          }
      }
      setPreview(base64);
      setFile(null); // Clear file state if any
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
      if (preview) {
          // Try to extract extension from mime type
          let ext = 'png';
          const match = preview.match(/data:image\/([a-zA-Z0-9]+);base64/);
          if (match && match[1]) {
              ext = match[1] === 'jpeg' ? 'jpg' : match[1];
          }
          download(preview, `decoded_image.${ext}`, `image/${ext}`);
      }
  };

  const getSEOContent = () => {
      if (tool.id === ToolID.IMAGE_TO_BASE64) {
          return (
              <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Image to Base64 Encoder</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Convert your image files (JPG, PNG, GIF, SVG, etc.) into <strong>base64 image online</strong> strings. Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. This tool is perfect for developers who need to <strong>embed image html</strong> sources directly into their code to reduce HTTP requests. By converting your <strong>picture to text</strong>, you create a self-contained Data URI that can be used instantly in web projects.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Using this <strong>image to base64 online</strong> utility offers significant performance benefits for small icons and logos. It allows for single-file portability, meaning you can send an HTML file with images included without needing a separate folder for assets. It serves as a powerful <strong>data uri generator</strong> and <strong>image code generator</strong> for modern web development.
                  </p>
                  <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-lg border border-gray-100 dark:border-slate-600">
                      <h4 className="font-bold text-gray-800 dark:text-white mb-3">Usage Examples</h4>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                          <li><strong>HTML:</strong> Use the generated string in the <code>&lt;img src="..." /&gt;</code> tag.</li>
                          <li><strong>CSS:</strong> Use it for <strong>css background base64</strong> images to avoid extra network calls.</li>
                          <li><strong>JSON:</strong> Easily transmit image data in API payloads by using <strong>convert image to string</strong> format.</li>
                      </ul>
                  </div>
                  <KeywordsBox keywords={['base64 image online', 'image to base64 online', 'image code generator', 'data uri generator', 'embed image html', 'base64 encoder', 'picture to text', 'convert image to string', 'html image embed', 'css background base64', 'base64 converter image', 'image to string converter', 'data url maker', 'encode image to base64']} />
              </>
          );
      } else {
          return (
              <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Base64 to Image Decoder</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Decode Base64 strings back into viewable image files with our <strong>base64 image decoder</strong>. Simply paste your Data URI string (e.g., <code>data:image/png;base64,...</code>) into the input field to instantly preview and download the original image format. This is essential for debugging APIs or extracting images embedded in code.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Our tool runs entirely in your browser. We do not upload your data to any server, ensuring your privacy is protected even when decoding sensitive images. Whether you need to <strong>view base64 image</strong> content or perform a full <strong>base64 to picture</strong> conversion, our utility handles it securely and efficiently.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      This <strong>base64 converter</strong> supports various formats including PNG, JPG, GIF, and SVG. Use it to <strong>decode data uri</strong> strings and <strong>save base64 as image</strong> files for editing or storage. It is the ultimate <strong>data url viewer</strong> and <strong>restore image from text</strong> tool for developers.
                  </p>
                  <KeywordsBox keywords={['base64 image online', 'base64 image decoder', 'convert string to image', 'view base64 image', 'base64 to picture', 'decode data uri', 'base64 converter', 'save base64 as image', 'data url viewer', 'restore image from text', 'base64 string to image', 'image decoder online', 'convert text to image', 'base64 preview']} />
              </>
          );
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        
        {tool.id === ToolID.IMAGE_TO_BASE64 ? (
            /* ENCODER UI */
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 md:p-8 animate-fadeIn">
                {!output ? (
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
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Drag & drop or click to choose file</p>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            Select Image
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/3">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Preview</label>
                                <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-2 bg-gray-50 dark:bg-slate-900 flex items-center justify-center min-h-[150px]">
                                    {preview && <img src={preview} alt="Preview" className="max-w-full max-h-[200px] object-contain rounded" />}
                                </div>
                                <button 
                                    onClick={() => { setOutput(''); setPreview(null); setFile(null); }}
                                    className="mt-4 w-full py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    Remove & Upload New
                                </button>
                            </div>
                            <div className="w-full md:w-2/3">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Base64 Output</label>
                                <textarea 
                                    readOnly 
                                    value={output} 
                                    className="w-full h-48 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-300 font-mono text-xs resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <button 
                                        onClick={() => copyToClipboard(output)}
                                        className={`flex-1 min-w-[120px] bg-blue-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 ${copySuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                    >
                                        {copySuccess ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                                Copy Base64
                                            </>
                                        )}
                                    </button>
                                    
                                    <button 
                                        onClick={() => copyToClipboard(`<img src="${output}" />`)}
                                        className="flex-1 min-w-[120px] bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                    >
                                        Copy HTML &lt;img&gt;
                                    </button>
                                    
                                    <button 
                                        onClick={() => copyToClipboard(`background-image: url('${output}');`)}
                                        className="flex-1 min-w-[120px] bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                    >
                                        Copy CSS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            /* DECODER UI */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Paste Base64 String</label>
                    <textarea 
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="w-full h-64 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-mono text-xs resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="data:image/png;base64,iVBORw0KGgo..."
                    />
                    <button 
                        onClick={handleDecode}
                        disabled={!textInput}
                        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                        Decode Image
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 flex flex-col">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image Preview</label>
                    <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900/50 flex items-center justify-center min-h-[250px] relative overflow-hidden">
                        {preview ? (
                            <img src={preview} alt="Decoded" className="max-w-full max-h-full object-contain p-2" />
                        ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">No image decoded yet</span>
                        )}
                    </div>
                    {preview && (
                        <button 
                            onClick={handleDownload}
                            className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            Download Image
                        </button>
                    )}
                </div>
            </div>
        )}

        <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            {getSEOContent()}
        </div>
    </div>
  );
};
