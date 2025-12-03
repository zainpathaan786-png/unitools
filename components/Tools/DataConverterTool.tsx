
import React, { useState, useRef, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';
import { DataUtils } from '../../utils/dataUtils';
import download from 'downloadjs';

interface Props {
  tool: ToolDefinition;
}

export const DataConverterTool: React.FC<Props> = ({ tool }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultExt, setResultExt] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedFile(null);
    setProcessing(false);
    setResultBlob(null);
    setResultExt('');
  }, [tool.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResultBlob(null);
    }
  };

  const getAcceptedTypes = () => {
      if (tool.id.includes('csv')) return '.csv';
      if (tool.id.includes('excel')) return '.xlsx, .xls';
      if (tool.id.includes('json')) return '.json';
      if (tool.id.includes('xml')) return '.xml';
      return '*';
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    try {
        const { blob, extension } = await DataUtils.convert(selectedFile, tool.id);
        setResultBlob(blob);
        setResultExt(extension);
    } catch (e) {
        console.error(e);
        alert("Conversion failed. Please check the file format.");
    } finally {
        setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (resultBlob) {
        const originalName = selectedFile?.name.split('.')[0] || 'converted_file';
        download(resultBlob, `${originalName}.${resultExt}`, resultBlob.type);
    }
  };

  const getSEOContent = () => {
      return (
          <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Online Data Converter</h2>
              <div className="grid md:grid-cols-2 gap-12">
                  <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Seamless Data Transformation</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          Transform your data files instantly between common formats like <strong>CSV, Excel (XLSX), JSON, and XML</strong>. 
                          Whether you are a developer needing to convert a database export to JSON, or an analyst moving XML data into Excel for reporting, this tool simplifies the process.
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Privacy & Security</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          Your data is processed <strong>locally in your browser</strong>. We do not upload your sensitive CSVs or Spreadsheets to any server. 
                          This ensures 100% data privacy, making it safe for confidential business data conversion.
                      </p>
                  </div>
              </div>
              <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Supported Conversions</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 dark:text-gray-400 text-sm">
                      <li>• <strong>CSV to Excel:</strong> Convert comma-separated values to spreadsheets.</li>
                      <li>• <strong>JSON to CSV:</strong> Flatten JSON objects into table rows.</li>
                      <li>• <strong>XML to JSON:</strong> Convert XML structures to JavaScript Objects.</li>
                      <li>• <strong>Excel to XML:</strong> Export spreadsheet data to XML format.</li>
                  </ul>
              </div>
          </>
      );
  };

  return (
    <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8 animate-fadeIn">
            {!selectedFile ? (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-blue-300 bg-blue-50 dark:bg-blue-900/10 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition h-[300px]"
                >
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">Upload {tool.id.split('-')[0].toUpperCase()} File</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Click to browse</p>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept={getAcceptedTypes()} 
                        className="hidden" 
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>

                    {!resultBlob ? (
                        <button 
                            onClick={handleConvert}
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Converting...
                                </>
                            ) : `Convert to ${tool.id.split('-to-')[1].toUpperCase()}`}
                        </button>
                    ) : (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Conversion Successful!</h3>
                            <div className="flex gap-3 justify-center">
                                <button 
                                    onClick={handleDownload}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    Download
                                </button>
                                <button 
                                    onClick={() => { setSelectedFile(null); setResultBlob(null); }}
                                    className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-200 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-600"
                                >
                                    Convert Another
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* NEW SEO CONTENT SECTION */}
        <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            {getSEOContent()}
        </div>
    </div>
  );
};
