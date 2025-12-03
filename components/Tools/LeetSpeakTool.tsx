
import React, { useState, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';

interface Props {
  tool: ToolDefinition;
}

// Basic Leet Map
const LEET_MAP: Record<string, string> = {
  'A': '4', 'B': '8', 'C': '(', 'D': '|)', 'E': '3', 'F': '|=', 'G': '6', 'H': '|-|', 'I': '1', 'J': '_|', 'K': '|<', 'L': '1', 'M': '|\\/|', 'N': '|\\|', 'O': '0', 'P': '|D', 'Q': '(,)', 'R': '|2', 'S': '5', 'T': '7', 'U': '|_|', 'V': '\\/', 'W': '\\/\\/', 'X': '><', 'Y': '`/', 'Z': '2',
  'a': '4', 'b': '8', 'c': '(', 'd': '|)', 'e': '3', 'f': '|=', 'g': '6', 'h': '|-|', 'i': '1', 'j': '_|', 'k': '|<', 'l': '1', 'm': '|\\/|', 'n': '|\\|', 'o': '0', 'p': '|D', 'q': '(,)', 'r': '|2', 's': '5', 't': '7', 'u': '|_|', 'v': '\\/', 'w': '\\/\\/', 'x': '><', 'y': '`/', 'z': '2'
};

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

export const LeetSpeakTool: React.FC<Props> = ({ tool }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  useEffect(() => {
    setInputText('');
    setOutputText('');
  }, [tool.id]);

  const handleConvert = () => {
    // Simple Text -> Leet
    const converted = inputText.split('').map(char => {
        return LEET_MAP[char] || char;
    }).join('');
    setOutputText(converted);
  };

  const getSEOContent = () => {
      return (
          <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">L33t Sp34k Generator</h2>
              <div className="grid md:grid-cols-2 gap-12">
                  <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">What is Leet Speak?</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          Leet (or "1337") is an alternative alphabet for the English language that is used primarily on the Internet. 
                          It involves replacing letters with numbers or special characters that resemble their appearance. For example, the letter "E" is often replaced with "3", and "A" with "4".
                          This tool acts as a <strong>leet converter</strong> to instantly transform your text into this stylized format.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          While originally used by hackers to obscure text from keyword filters, today it is mostly used for fun, gaming handles, and memes. Our <strong>leet speak generator</strong> creates classic "basic leet" which is readable but distinct. It is the perfect <strong>gamer text generator</strong> for creating unique usernames.
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Origins & Culture</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          It originated in the 1980s within bulletin board systems (BBS) and hacker communities as a way to bypass text filters or simply show "elite" status. 
                          While less common today, it remains a popular stylistic choice in gaming usernames (gamertags) and internet memes. Use our <strong>hacker text maker</strong> for retro flair.
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          Convert your name or messages instantly. Whether you want to act like a "h4x0r" or just want a cool looking bio, this <strong>1337 translator</strong> does the job. It also works as a general <strong>text obfuscator</strong> for casual use.
                      </p>
                  </div>
              </div>
              <KeywordsBox keywords={['leet speak generator', 'l33t sp34k translator', 'leet converter', 'gamer text generator', 'hacker text maker', '1337 translator', 'leet alphabet', 'funny text generator', 'text obfuscator', 'internet slang converter', '1337 generator', 'leet maker', 'gamer text', 'leet speak converter', 'hacker text generator']} />
          </>
      );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                <label className="block text-sm font-bold mb-2 dark:text-white">Input Text</label>
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-40 p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter text to convert..."
                />
            </div>
            <div className="flex flex-col justify-center gap-4">
                <button onClick={handleConvert} className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
                    Translate to Leet
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                <label className="block text-sm font-bold mb-2 dark:text-white">Output</label>
                <textarea 
                    readOnly
                    value={outputText}
                    className="w-full h-40 p-3 border rounded-lg bg-gray-100 dark:bg-slate-900 dark:text-white font-mono text-sm resize-none"
                />
            </div>
        </div>
        
        <div className="mt-8 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            {getSEOContent()}
        </div>
    </div>
  );
};
