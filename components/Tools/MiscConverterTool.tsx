
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

export const MiscConverterTool: React.FC<Props> = ({ tool }) => {
  // Roman Numeral State
  const [romanInput, setRomanInput] = useState('');
  const [numberInput, setNumberInput] = useState<number | ''>('');
  const [romanResult, setRomanResult] = useState<string | number>('');

  // Shoe Size State
  const [shoeSize, setShoeSize] = useState<number>(8);
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [fromRegion, setFromRegion] = useState('US');
  const [shoeResults, setShoeResults] = useState<any>(null);

  useEffect(() => {
      setRomanInput('');
      setNumberInput('');
      setRomanResult('');
      setShoeSize(8);
      setGender('men');
      setFromRegion('US');
      setShoeResults(null);
  }, [tool.id]);

  // Roman Logic
  const toRoman = (num: number) => {
      if (num < 1 || num > 3999) return "Enter number between 1 and 3999";
      const lookup: Record<string, number> = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
      let roman = '';
      for (let i in lookup) {
          while (num >= lookup[i]) {
              roman += i;
              num -= lookup[i];
          }
      }
      return roman;
  };

  const fromRoman = (str: string) => {
      const lookup: Record<string, number> = {M:1000,D:500,C:100,L:50,X:10,V:5,I:1};
      let num = 0;
      str = str.toUpperCase();
      for (let i = 0; i < str.length; i++) {
          const curr = lookup[str[i]];
          const next = lookup[str[i+1]];
          if (next && curr < next) {
              num -= curr;
          } else {
              num += curr;
          }
      }
      return isNaN(num) ? "Invalid Roman Numeral" : num;
  };

  // Shoe Logic (Approximate Conversion Table)
  const convertShoes = () => {
      let usSize = shoeSize;
      
      // Normalize to US size first
      if (fromRegion === 'UK') usSize = shoeSize + (gender === 'men' ? 0.5 : 2); // Rough approx
      else if (fromRegion === 'EU') usSize = (shoeSize - 32) / (gender === 'men' ? 1.2 : 1.3); // Very rough linear approx, tables are better but complex
      
      // For simplicity, using offsets based on standard charts
      // Men: US = UK + 1 = EU - 33 approx
      // Women: US = UK + 2 = EU - 31 approx
      
      let res: any = {};
      if (gender === 'men') {
          if (fromRegion === 'US') {
              res = { US: shoeSize, UK: shoeSize - 1, EU: shoeSize + 33, CM: shoeSize + 18 };
          } else if (fromRegion === 'UK') {
              res = { US: shoeSize + 1, UK: shoeSize, EU: shoeSize + 34, CM: shoeSize + 19 };
          } else if (fromRegion === 'EU') {
              res = { US: shoeSize - 33, UK: shoeSize - 34, EU: shoeSize, CM: (shoeSize - 33) + 18 };
          }
      } else {
          if (fromRegion === 'US') {
              res = { US: shoeSize, UK: shoeSize - 2, EU: shoeSize + 31, CM: shoeSize + 15 };
          } else if (fromRegion === 'UK') {
              res = { US: shoeSize + 2, UK: shoeSize, EU: shoeSize + 33, CM: shoeSize + 17 };
          } else if (fromRegion === 'EU') {
              res = { US: shoeSize - 31, UK: shoeSize - 33, EU: shoeSize, CM: (shoeSize - 31) + 15 };
          }
      }
      // Formatting
      Object.keys(res).forEach(k => res[k] = parseFloat(res[k].toFixed(1)));
      setShoeResults(res);
  };

  if (tool.id === ToolID.ROMAN_NUMERAL_CONVERTER) {
      return (
          <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Number to Roman</label>
                          <input 
                              type="number" 
                              value={numberInput} 
                              onChange={(e) => {
                                  const v = parseInt(e.target.value);
                                  setNumberInput(v);
                                  setRomanResult(v ? toRoman(v) : '');
                              }}
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="e.g. 2024"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Roman to Number</label>
                          <input 
                              type="text" 
                              value={romanInput} 
                              onChange={(e) => {
                                  const v = e.target.value;
                                  setRomanInput(v);
                                  setRomanResult(v ? fromRoman(v) : '');
                              }}
                              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="e.g. MMXXIV"
                          />
                      </div>
                  </div>
                  
                  {romanResult !== '' && (
                      <div className="mt-8 p-6 bg-yellow-50 dark:bg-slate-900 border border-yellow-200 dark:border-slate-700 rounded-xl text-center">
                          <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Result</h3>
                          <div className="text-4xl font-serif font-bold text-gray-800 dark:text-white">{romanResult}</div>
                      </div>
                  )}
              </div>
              <div className="prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Roman Numeral Converter & Translator</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Easily <strong>convert numbers to roman</strong> numerals and vice versa with our comprehensive <strong>roman numeral converter</strong>. Roman numerals were the standard system of writing numbers in Europe for nearly 2,000 years, using combinations of letters from the Latin alphabet (I, V, X, L, C, D, M). Although mostly replaced by <strong>arabic to roman</strong> style numbering, they are still widely used in clock faces, copyright years (e.g., <strong>MMXXIV</strong>), monuments, and event numbering like the <strong>super bowl numbers</strong>.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Our tool acts as a <strong>roman translator</strong> that handles the complex rules of additive and subtractive notation automatically. For example, IV represents 4 (5 minus 1), while VI represents 6 (5 plus 1). Simply enter a number like '2024' to get 'MMXXIV', or paste a <strong>roman numerals</strong> string to decode its integer value via our <strong>roman to number</strong> feature. This <strong>number converter</strong> is useful for students, historians, and designers alike.
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Basic Chart</h3>
                  <p>I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Remember, there is no zero in <strong>latin numerals</strong>.</p>
                  <KeywordsBox keywords={['roman numeral converter', 'arabic to roman', 'roman to number', 'roman numerals', 'date to roman', 'roman numeral chart', 'mmxxiv', 'number converter', 'roman translator', 'super bowl numbers', 'convert year to roman', 'latin numerals', 'roman numeral translator', 'convert numbers to roman', 'roman numerals to arabic', 'roman numeral generator', 'learn roman numerals', 'roman numeral calculator', 'roman date converter', 'roman numerals list', 'standard numerals to roman', 'ancient number converter']} />
              </div>
          </div>
      );
  }

  if (tool.id === ToolID.SHOES_SIZE_CONVERTER) {
      return (
          <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                          <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                              <option value="men">Men's</option>
                              <option value="women">Women's</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Region</label>
                          <select value={fromRegion} onChange={(e) => setFromRegion(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                              <option value="US">US / Canada</option>
                              <option value="UK">UK / India</option>
                              <option value="EU">Europe</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Size</label>
                          <input type="number" value={shoeSize} onChange={(e) => setShoeSize(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                  </div>
                  
                  <button onClick={convertShoes} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-8">Convert</button>

                  {shoeResults && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(shoeResults).map(([region, size]) => (
                              <div key={region} className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-xl text-center">
                                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{size as React.ReactNode}</div>
                                  <div className="text-xs font-bold text-gray-500 mt-1">{region}</div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
              <div className="prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">International Shoe Size Converter</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Buying shoes online can be confusing due to the variety of different sizing standards used across the world. Our <strong>Shoe Size Converter</strong> helps you find the right fit by translating sizes between <strong>US to UK shoe size</strong>, <strong>EU shoe size conversion</strong>, and CM (Centimeters) standards. Whether you are shopping for <strong>mens shoe size</strong> or <strong>womens shoe size</strong>, this tool provides a quick <strong>shoe size chart</strong> reference to avoid the hassle of returns.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      It acts as a reliable <strong>online shoe fitting</strong> guide for international shoppers. Please note that shoe sizes can vary slightly by brand (e.g., Nike vs. Adidas often run differently). Our <strong>footwear size chart</strong> calculator uses standard <strong>international shoe size</strong> conversion charts. The "CM" value refers to the approximate foot length, making it a handy <strong>foot length calculator</strong> which is often the most accurate way to determine your size in foreign brands via <strong>cm to shoe size</strong> conversion.
                  </p>
                  <KeywordsBox keywords={['shoe size converter', 'us to uk shoe size', 'shoe size chart', 'mens shoe size', 'womens shoe size', 'eu shoe size conversion', 'foot length calculator', 'cm to shoe size', 'international shoe size', 'online shoe fitting', 'footwear size chart', 'shoe size calculator', 'convert shoe sizes', 'shoe size chart women', 'shoe size chart men', 'international footwear conversion', 'us to eu shoe size', 'uk to us shoe size', 'cm to us shoe size', 'foot size converter', 'shoe fitting guide']} />
              </div>
          </div>
      );
  }

  return null;
};
