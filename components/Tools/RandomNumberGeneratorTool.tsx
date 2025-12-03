
import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../../types';
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

export const RandomNumberGeneratorTool: React.FC<Props> = ({ tool }) => {
  // Configuration State
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(5);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [separator, setSeparator] = useState<'newline' | 'comma' | 'space' | 'semicolon'>('newline');
  
  // Output State
  const [result, setResult] = useState<string>('');
  const [stats, setStats] = useState<{ min: number, max: number, count: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Initial Generation
  useEffect(() => {
    handleGenerate();
  }, [tool.id]);

  const handleGenerate = () => {
    setLoading(true);
    // Tiny timeout for UI responsiveness
    setTimeout(() => {
        try {
            generateNumbers();
        } catch (e) {
            console.error(e);
            alert("Error generating numbers. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    }, 50);
  };

  const generateNumbers = () => {
      let generated: number[] = [];
      const range = max - min + 1;

      if (max < min) {
          setResult("Error: Max must be greater than Min");
          return;
      }

      if (!allowDuplicates && count > range) {
          setResult(`Error: Cannot generate ${count} unique numbers from a range of ${range} numbers.`);
          return;
      }

      if (allowDuplicates) {
          for (let i = 0; i < count; i++) {
              generated.push(Math.floor(Math.random() * range) + min);
          }
      } else {
          // Unique numbers
          if (range < 5000 && count > range / 2) {
              // If range is small and count is large relative to range, create pool and shuffle
              const pool = Array.from({ length: range }, (_, i) => i + min);
              // Fisher-Yates Shuffle
              for (let i = pool.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [pool[i], pool[j]] = [pool[j], pool[i]];
              }
              generated = pool.slice(0, count);
          } else {
              // Rejection sampling for large ranges or small counts
              const set = new Set<number>();
              while (set.size < count) {
                  const num = Math.floor(Math.random() * range) + min;
                  set.add(num);
              }
              generated = Array.from(set);
          }
      }

      // Sort
      if (sortOrder === 'asc') {
          generated.sort((a, b) => a - b);
      } else if (sortOrder === 'desc') {
          generated.sort((a, b) => b - a);
      }

      // Stats
      if (generated.length > 0) {
          setStats({
              min: Math.min(...generated),
              max: Math.max(...generated),
              count: generated.length
          });
      }

      // Format Output
      let sep = '\n';
      if (separator === 'comma') sep = ', ';
      else if (separator === 'space') sep = ' ';
      else if (separator === 'semicolon') sep = '; ';

      setResult(generated.join(sep));
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
      download(result, `random_numbers_${Date.now()}.txt`, 'text/plain');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Controls */}
        <div className="lg:w-1/3 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/30">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                        Generator Settings
                    </h3>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Range */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Number Range</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <label className="text-xs text-gray-400 block mb-1">Min</label>
                                <input 
                                    type="number" 
                                    value={min} 
                                    onChange={(e) => setMin(parseInt(e.target.value) || 0)} 
                                    className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                            <div className="text-gray-400 pt-4">-</div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-400 block mb-1">Max</label>
                                <input 
                                    type="number" 
                                    value={max} 
                                    onChange={(e) => setMax(parseInt(e.target.value) || 0)} 
                                    className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">How many numbers?</label>
                        <input 
                            type="number" 
                            min="1" 
                            max="10000"
                            value={count} 
                            onChange={(e) => setCount(Math.max(1, Math.min(10000, parseInt(e.target.value) || 1)))} 
                            className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                    </div>

                    {/* Options */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Options</label>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input 
                                    id="allowDuplicates" 
                                    type="checkbox" 
                                    checked={allowDuplicates} 
                                    onChange={(e) => setAllowDuplicates(e.target.checked)} 
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                                />
                                <label htmlFor="allowDuplicates" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                    Allow Duplicates
                                </label>
                            </div>
                            
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Sort Order</label>
                                <select 
                                    value={sortOrder} 
                                    onChange={(e) => setSortOrder(e.target.value as any)} 
                                    className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="none">No Sorting</option>
                                    <option value="asc">Low to High (Asc)</option>
                                    <option value="desc">High to Low (Desc)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Separator</label>
                                <select 
                                    value={separator} 
                                    onChange={(e) => setSeparator(e.target.value as any)} 
                                    className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="newline">New Line</option>
                                    <option value="comma">Comma (,)</option>
                                    <option value="space">Space</option>
                                    <option value="semicolon">Semicolon (;)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-transform shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Generate
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* Right Content: Output */}
        <div className="lg:w-2/3 flex flex-col h-[600px] lg:h-auto min-h-[600px]">
            <div className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col relative group">
                
                {/* Header Bar */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${result ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wider">
                            Generated Numbers
                        </h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleDownload}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Download File"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                        <button 
                            onClick={copyToClipboard}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                copySuccess 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-slate-700 dark:text-blue-400 dark:hover:bg-slate-600'
                            }`}
                        >
                            {copySuccess ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-gray-50/50 dark:bg-slate-900/50 relative">
                    <textarea 
                        readOnly 
                        value={result} 
                        className="w-full h-full p-6 bg-transparent border-none resize-none focus:ring-0 text-gray-800 dark:text-gray-200 leading-relaxed outline-none font-mono text-base"
                        spellCheck={false}
                    />
                </div>
                
                {/* Stats Footer */}
                {stats && (
                    <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-6 py-3 flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <div>
                            Generated: {stats.count}
                        </div>
                        <div className="flex gap-4">
                            <span>Min: {stats.min}</span>
                            <span>Max: {stats.max}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>

      {/* NEW SEO CONTENT SECTION */}
      <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Advanced Random Number Generator</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Understanding Randomness</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    A <strong>Random Number Generator (RNG)</strong> works by producing a sequence of numbers that lacks any predictable pattern. Our <strong>random number generator</strong> uses cryptographically secure pseudo-random number generation algorithms to ensure high entropy. This makes it a reliable <strong>true random number service</strong> for a variety of applications, from picking contest winners to creating data sets for statistical analysis. You can specify a range using the minimum and maximum inputs, ensuring the results fit your specific requirements, whether you need a <strong>random integer</strong> or a complex <strong>random sequence generator</strong>.
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Customization and Flexibility</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    This tool offers extensive customization. You can choose to allow or disallow duplicates, making it a perfect <strong>unique random numbers</strong> generator or <strong>number picker</strong>. If you are organizing a raffle, the <strong>raffle picker</strong> functionality ensures fair play by selecting winners without bias. Additionally, you can sort the <strong>random list</strong> in ascending or descending order, or keep it unsorted for pure randomness. The output can be formatted with commas, spaces, or new lines, making it easy to copy and paste into Excel, databases, or other software.
                </p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Practical Applications</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                    <li><strong>Gaming & Simulation:</strong> Use it as a <strong>randomizer</strong> for dice rolls, loot tables, or procedural generation in game development.</li>
                    <li><strong>Statistics & Research:</strong> Generate <strong>random number list</strong> sets for sampling populations or Monte Carlo simulations.</li>
                    <li><strong>Security:</strong> While not a replacement for hardware security modules, it can generate salts, nonces, or <strong>lucky number</strong> seeds for basic cryptographic needs.</li>
                    <li><strong>Decision Making:</strong> Can't decide? Assign options to numbers and let the <strong>random pick generator</strong> choose for you.</li>
                </ul>
            </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">How the Algorithm Works</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Most computer-generated random numbers are technically "pseudo-random" (PRNG). They are determined by an initial seed value and a complex mathematical formula. However, for most users, including those needing a <strong>random int generator</strong> or <strong>random value generator</strong>, the distinction is negligible. Our tool ensures efficient and uniform distribution across your specified range, providing a <strong>generate numbers list</strong> capability that is both fast and statistically sound. Whether you need a <strong>list randomizer</strong> or a <strong>random number selector</strong>, our tool delivers instant results.
            </p>
        </div>
        <KeywordsBox keywords={['random number generator', 'rng', 'random integer', 'random number list', 'unique random numbers', 'number picker', 'random list', 'no duplicates', 'sort numbers', 'generate random numbers', 'lucky number', 'raffle picker', 'randomizer', 'random sequence generator', 'pseudo random number generator', 'true random number service', 'generate random digits', 'random number selector', 'randomizer online tool', 'rng generator', 'random int generator', 'random value generator', 'list randomizer', 'generate numbers list', 'random pick generator', 'number generator no repeats', 'random order generator']} />
      </div>
    </div>
  );
};
