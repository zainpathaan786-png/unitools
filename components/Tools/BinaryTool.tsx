
import React, { useState, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';

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

export const BinaryTool: React.FC<Props> = ({ tool }) => {
  // Conversion State
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Calculator State
  const [bin1, setBin1] = useState('');
  const [bin2, setBin2] = useState('');
  const [operation, setOperation] = useState('+');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [decimalResult, setDecimalResult] = useState<string | null>(null);

  useEffect(() => {
    setInputText('');
    setOutputText('');
    setBin1('');
    setBin2('');
    setCalcResult(null);
    setDecimalResult(null);
  }, [tool.id]);

  const handleConvert = () => {
      if (tool.id === ToolID.TEXT_TO_BINARY) {
          const binary = inputText.split('').map(char => {
              return char.charCodeAt(0).toString(2).padStart(8, '0');
          }).join(' ');
          setOutputText(binary);
      } else if (tool.id === ToolID.BINARY_TO_TEXT) {
          try {
              // Clean input
              let cleanInput = inputText.replace(/[\r\n]+/g, ' ').trim();
              
              // Detect if it's a continuous stream or space-separated
              // If it has spaces, split by space. 
              // If no spaces, split every 8 characters.
              let tokens: string[] = [];
              
              if (cleanInput.includes(' ')) {
                  tokens = cleanInput.split(/\s+/);
              } else {
                  // Continuous stream
                  const match = cleanInput.match(/.{1,8}/g);
                  if (match) tokens = match;
              }

              const text = tokens.map(bin => {
                  // Ensure valid binary
                  if (!/^[01]+$/.test(bin)) return ''; // Skip invalid
                  return String.fromCharCode(parseInt(bin, 2));
              }).join('');
              
              setOutputText(text);
          } catch (e) {
              setOutputText("Error: Invalid binary format");
          }
      }
  };

  const handleCalculate = () => {
      if (!bin1 || !bin2) return;

      const n1 = parseInt(bin1, 2);
      const n2 = parseInt(bin2, 2);
      
      if (isNaN(n1) || isNaN(n2)) {
          setCalcResult('Invalid Binary Input');
          setDecimalResult(null);
          return;
      }

      let res = 0;
      if (operation === '+') res = n1 + n2;
      else if (operation === '-') res = n1 - n2;
      else if (operation === '*') res = n1 * n2;
      else if (operation === '/') {
          if (n2 === 0) {
              setCalcResult('Division by Zero');
              setDecimalResult(null);
              return;
          }
          res = Math.floor(n1 / n2);
      }
      else if (operation === '&') res = n1 & n2;
      else if (operation === '|') res = n1 | n2;
      else if (operation === '^') res = n1 ^ n2;

      setCalcResult(res.toString(2));
      setDecimalResult(res.toString(10));
  };

  const getSEOContent = () => {
      if (tool.id === ToolID.BINARY_CALCULATOR) {
          return (
              <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Binary Calculator & Arithmetic</h2>
                  <div className="grid md:grid-cols-2 gap-12">
                      <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Base-2 Mathematics</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              Perform mathematical operations directly on binary numbers. Our <strong>binary calculator</strong> allows you to execute <strong>binary addition</strong>, subtraction, multiplication, and division without manually converting to decimal first. It also supports <strong>bitwise operations</strong> like AND, OR, and XOR, which are fundamental to computer logic.
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              Binary (base-2) is the language of computers, representing all data using only 0s and 1s. This <strong>base-2 calculator</strong> is an essential tool for computer science students, digital electronics engineers, and programmers. It simplifies complex <strong>binary math</strong> tasks, allowing you to debug code or verify <strong>logic gates simulator</strong> outputs instantly.
                          </p>
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Features</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              In addition to standard arithmetic, this tool acts as a <strong>binary to decimal calculator</strong> by displaying the decimal equivalent of your result. Whether you need a <strong>binary multiplier</strong>, <strong>binary subtractor</strong>, or a <strong>digital math</strong> learning aid, this <strong>computer math tool</strong> covers all the bases for working with the binary system.
                          </p>
                      </div>
                  </div>
                  <KeywordsBox keywords={['binary calculator', 'binary addition', 'bitwise operations', 'binary math', 'binary multiplication', 'binary division', 'base-2 calculator', 'xor calculator', 'logic gates simulator', 'digital math', 'binary subtractor', 'computer math tool', 'binary to decimal calculator', 'binary arithmetic calculator', 'binary math solver', 'calculate binary numbers', 'binary operations tool', 'bitwise AND calculator', 'bitwise OR calculator', 'binary subtraction tool', 'binary multiplication online', 'digital logic calculator', 'base 2 math']} />
              </>
          );
      } else {
          return (
              <>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{tool.title}</h2>
                  <div className="grid md:grid-cols-2 gap-12">
                      <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Understanding Binary Code</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              Binary code represents text, computer processor instructions, or any other data using a two-symbol system. 
                              When you convert text to binary, each character is replaced by a sequence of 8 bits (a byte) based on ASCII or Unicode standards. For example, the capital letter "A" becomes "01000001". This <strong>binary translator</strong> makes the process visible.
                          </p>
                      </div>
                      <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">How it Works</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              {tool.id === ToolID.TEXT_TO_BINARY 
                                  ? "This tool converts standard text into machine-readable binary strings. It translates every letter, number, and symbol into its corresponding 8-bit binary sequence. Use this text to binary converter for educational purposes or data encoding."
                                  : "This tool decodes binary strings back into readable human text. It intelligently handles both space-separated bytes (e.g. '01001000 01101001') and continuous binary streams (e.g. '0100100001101001'), making it a robust binary code converter."
                              }
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              Whether you are learning computer science basics or need to decode a hidden message, our <strong>convert binary</strong> tool is fast and accurate. It also handles <strong>binary to ascii</strong> conversion seamlessly.
                          </p>
                      </div>
                  </div>
                  <KeywordsBox keywords={['binary to text', 'text to binary', 'binary converter', 'binary code translator', 'translate binary', 'binary decoder', 'binary encoder', 'ascii to binary', 'binary string', 'computer language translator', 'binary text', '8 bit converter', 'binary translator', 'convert binary', 'binary code converter', 'text to binary converter', 'binary to ascii']} />
              </>
          );
      }
  };

  if (tool.id === ToolID.BINARY_CALCULATOR) {
      return (
          <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Binary Calculator</h3>
                  <div className="flex flex-col gap-4">
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Binary Number</label>
                          <input 
                              type="text" 
                              value={bin1} 
                              onChange={(e) => setBin1(e.target.value.replace(/[^01]/g, ''))} 
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                              placeholder="e.g., 1010"
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Operation</label>
                          <select 
                              value={operation} 
                              onChange={(e) => setOperation(e.target.value)} 
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                              <option value="+">Add (+)</option>
                              <option value="-">Subtract (-)</option>
                              <option value="*">Multiply (*)</option>
                              <option value="/">Divide (/)</option>
                              <option value="&">AND (&)</option>
                              <option value="|">OR (|)</option>
                              <option value="^">XOR (^)</option>
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Second Binary Number</label>
                          <input 
                              type="text" 
                              value={bin2} 
                              onChange={(e) => setBin2(e.target.value.replace(/[^01]/g, ''))} 
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
                              placeholder="e.g., 0101"
                          />
                      </div>

                      <button onClick={handleCalculate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mt-2">Calculate</button>
                  </div>
                  
                  {calcResult !== null && (
                      <div className="mt-8 p-6 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-xl text-center">
                          <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Result</h4>
                          <div className="text-3xl font-mono font-bold text-blue-700 dark:text-blue-400 break-all">{calcResult}</div>
                          {decimalResult && <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Decimal: {decimalResult}</div>}
                      </div>
                  )}
              </div>
              
              <div className="mt-8 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                  {getSEOContent()}
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <label className="block text-sm font-bold mb-2 dark:text-white">{tool.id === ToolID.TEXT_TO_BINARY ? 'Input Text' : 'Input Binary'}</label>
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-40 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={tool.id === ToolID.TEXT_TO_BINARY ? "Hello World" : "01001000 01100101 01101100 01101100 01101111"}
                />
            </div>
            <div className="flex flex-col justify-center gap-4">
                <button onClick={handleConvert} className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md w-full md:w-auto self-center px-8">
                    {tool.id === ToolID.TEXT_TO_BINARY ? 'Convert to Binary' : 'Convert to Text'} &rarr;
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <label className="block text-sm font-bold mb-2 dark:text-white">{tool.id === ToolID.TEXT_TO_BINARY ? 'Binary Output' : 'Text Output'}</label>
                <textarea 
                    readOnly
                    value={outputText}
                    className="w-full h-40 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-0"
                />
            </div>
        </div>
        
        <div className="mt-8 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            {getSEOContent()}
        </div>
    </div>
  );
};
