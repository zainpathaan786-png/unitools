
import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../../types';

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

export const TextDiffTool: React.FC<Props> = ({ tool }) => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState<React.ReactNode[] | null>(null);

  useEffect(() => {
    setText1('');
    setText2('');
    setDiffResult(null);
  }, [tool.id]);

  const compareText = () => {
    if (!text1 && !text2) {
        setDiffResult(null);
        return;
    }

    // Simple diff logic (line-by-line)
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    
    const result: React.ReactNode[] = [];

    for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] || '';
        const line2 = lines2[i] || '';

        if (line1 === line2) {
            result.push(
                <div key={i} className="grid grid-cols-2 gap-4 border-b border-gray-100 dark:border-slate-700 py-1 hover:bg-gray-50 dark:hover:bg-slate-800">
                    <div className="text-gray-600 dark:text-gray-400 px-2 font-mono whitespace-pre-wrap break-all">{line1}</div>
                    <div className="text-gray-600 dark:text-gray-400 px-2 font-mono whitespace-pre-wrap break-all">{line2}</div>
                </div>
            );
        } else {
            result.push(
                <div key={i} className="grid grid-cols-2 gap-4 border-b border-gray-100 dark:border-slate-700 py-1">
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 font-mono whitespace-pre-wrap break-all">{line1 || <span className="opacity-30">[Empty]</span>}</div>
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 font-mono whitespace-pre-wrap break-all">{line2 || <span className="opacity-30">[Empty]</span>}</div>
                </div>
            );
        }
    }
    setDiffResult(result);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Original Text</label>
                <textarea 
                    value={text1}
                    onChange={(e) => setText1(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste original text here..."
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Changed Text</label>
                <textarea 
                    value={text2}
                    onChange={(e) => setText2(e.target.value)}
                    className="w-full h-64 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste changed text here..."
                />
            </div>
        </div>

        <div className="flex justify-center">
            <button onClick={compareText} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
                Compare Texts
            </button>
        </div>

        {diffResult && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden animate-fadeIn">
                <div className="grid grid-cols-2 gap-4 bg-gray-100 dark:bg-slate-700 p-3 font-bold text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-slate-600">
                    <div>Original</div>
                    <div>Changed</div>
                </div>
                <div className="p-0 text-sm">
                    {diffResult}
                </div>
            </div>
        )}

        <div className="mt-8 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Text Diff Checker</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Compare two blocks of text side-by-side to identify differences instantly. This tool highlights changed, added, or removed lines, making it easy to spot edits in code snippets, documents, lists, or any text file. Our <strong>online diff checker</strong> is fast and efficient.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Whether you're a developer checking code versions or a writer reviewing edits, our <strong>diff tool</strong> provides a clear visual representation of changes. It runs entirely in your browser, ensuring your private data remains secure. You can <strong>compare two texts</strong> without uploading sensitive files.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Use this <strong>text comparison utility</strong> to audit changes. It serves as a lightweight <strong>diff viewer</strong> for quick checks. Easily <strong>check text differences</strong> and merge content with confidence using this <strong>text compare tool</strong>.
            </p>
            <KeywordsBox keywords={['text diff checker', 'compare text online', 'find difference between two texts', 'diff tool', 'compare strings', 'text comparison utility', 'code diff viewer', 'spot changes in text', 'document comparison', 'compare content', 'online diff checker', 'compare two texts', 'diff viewer', 'text compare tool', 'check text differences']} />
        </div>
    </div>
  );
};
