import React, { useState, useRef } from 'react';
import { ToolDefinition } from '../../types';
import download from 'downloadjs';
import JSZip from 'jszip';

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

export const CreateZipTool: React.FC<Props> = ({ tool }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const newFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...newFiles]);
    }
    // Reset input
    if (e.target) e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const createZip = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    
    try {
        const zip = new JSZip();
        
        // Add files to zip
        files.forEach(file => {
            zip.file(file.name, file);
        });
        
        // Generate zip file
        const content = await zip.generateAsync({ type: 'blob' });
        download(content, `archive_${Date.now()}.zip`, 'application/zip');
        
    } catch (e) {
        console.error(e);
        alert("Failed to create ZIP file.");
    } finally {
        setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 md:p-8 animate-fadeIn">
        
        {/* Upload Area */}
        <div
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 mb-8 ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-slate-700' : 'border-blue-200 dark:border-slate-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 00-2-2V8m-9 4h4" />
                </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">Upload Files</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Drag & drop files here or click to browse</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm">
                Add Files
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                multiple
                className="hidden" 
            />
        </div>

        {/* File List */}
        {files.length > 0 && (
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200">Selected Files ({files.length})</h3>
                    <button onClick={() => setFiles([])} className="text-red-500 text-sm hover:underline">Clear All</button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                    {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z"/></svg>
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                                <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 p-1">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Action */}
        <button 
            onClick={createZip}
            disabled={files.length === 0 || processing}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
            {processing ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Creating ZIP...
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download ZIP
                </>
            )}
        </button>

      </div>
      
      <div className="mt-8 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create Zip Archives Online</h2>
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Compress & Organize Files</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Need to send multiple files via email but hitting the attachment limit? Or simply want to organize your documents into a single package? 
                    Our <strong>Zip Creator</strong> allows you to <strong>combine files to zip</strong> format instantly. Whether you have images, documents, or text files, our tool acts as a powerful <strong>zip maker</strong> and <strong>zip archiver</strong> that groups everything into a standard compressed ZIP folder.
                    This tool helps reduce file size and declutter your digital workspace by merging scattered files into one organized archive. It is the perfect <strong>file bundler</strong> for sharing large collections of data.
                </p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Secure Client-Side Processing</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Security is our top priority. Unlike many other <strong>online archiver</strong> tools that require file uploads, our process runs <strong>100% in your browser</strong> using JavaScript. 
                    This <strong>client side zip</strong> creation means your files are never uploaded to a remote server, ensuring total privacy for your sensitive documents, photos, and data. You can <strong>compress files online</strong> of any size without worrying about bandwidth limits or data breaches. It serves as a <strong>secure file compression</strong> utility that respects your privacy.
                </p>
            </div>
        </div>
        <KeywordsBox keywords={['create zip file', 'zip maker', 'compress files online', 'zip archiver', 'client side zip', 'secure file compression', 'combine files to zip', 'make zip', 'online archiver', 'zip folders', 'file bundler', 'free zip tool', 'no upload zip', 'browser zip creation', 'zip file creator', 'online zip compressor', 'make zip file online', 'compress pdf to zip', 'compress images to zip', 'zip extractor alternative', 'create archive online', 'file compressor tool', 'zip documents online', 'secure zip creator', 'browser based zip', 'zip multiple files', 'create zip folder']} />
      </div>
    </div>
  );
};