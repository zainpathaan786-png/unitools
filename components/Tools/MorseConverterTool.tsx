
import React, { useState, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';

interface Props {
  tool: ToolDefinition;
}

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/'
};

const REVERSE_MORSE: Record<string, string> = Object.entries(MORSE_CODE).reduce((acc, [key, val]) => {
    acc[val] = key;
    return acc;
}, {} as Record<string, string>);

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

export const MorseConverterTool: React.FC<Props> = ({ tool }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  useEffect(() => {
    setInputText('');
    setOutputText('');
  }, [tool.id]);

  const handleConvert = () => {
      // Determine direction or force based on Tool ID
      // But Morse Translator is usually bi-directional or auto-detect
      // If tool is GENERATOR, we assume Text -> Morse
      // If tool is TRANSLATOR, we check input content
      
      let isToMorse = true;
      if (tool.id === ToolID.MORSE_CODE_GENERATOR) {
          isToMorse = true;
      } else {
          // Auto-detect: if input contains only . - / and spaces, assume it's morse
          const morseChars = new Set(['.', '-', '/', ' ']);
          const inputChars = inputText.trim().split('').filter(c => c !== '\n');
          const isMorseInput = inputChars.length > 0 && inputChars.every(c => morseChars.has(c));
          isToMorse = !isMorseInput;
      }

      if (isToMorse) {
          // Text -> Morse
          const morse = inputText.toUpperCase().split('').map(char => {
              if (char === '\n') return '\n';
              return MORSE_CODE[char] || char; // Keep unknown chars as is? Or skip?
          }).join(' ');
          setOutputText(morse);
      } else {
          // Morse -> Text
          // Split by spaces (letter separator) or / (word separator)
          // We normalized ' ' to '/' in our map for generation, so standard Morse uses spaces between letters and / or  triple space between words
          // Let's assume standard input format: Letters separated by space, Words by " / " or "   "
          
          const words = inputText.split(' / '); // Split words first if using slash
          // If no slashes, split by triple space? Or just treat whole string
          
          let decoded = "";
          
          // Simple parser: Split by space. If item is '/', add space. Else decode char.
          const tokens = inputText.trim().split(/\s+/);
          
          decoded = tokens.map(t => {
              if (t === '/') return ' ';
              return REVERSE_MORSE[t] || '?';
          }).join('');
          
          setOutputText(decoded);
      }
  };

  const getSEOContent = () => {
      return (
          <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Morse Code Translator</h2>
              <div className="grid md:grid-cols-2 gap-12">
                  <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">History & Usage</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          Invented by Samuel Morse in the 1830s, Morse code is a method used in telecommunication to encode text characters as standardized sequences of two different signal durations, called dots and dashes (or dits and dahs). 
                          It revolutionized long-distance communication before the telephone and is still used today in amateur radio and emergency signaling (SOS). Our <strong>morse code converter</strong> brings this historic tech to your browser.
                      </p>
                  </div>
                  <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">How to Use</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                          This tool works both ways. Enter standard text to generate Morse code, or paste Morse code (dots and dashes) to decode it back into readable text. 
                          We use a forward slash (/) to separate words and a space to separate letters.
                          <br/><br/>
                          <strong>Example:</strong> "SOS" becomes <code>... --- ...</code> using our <strong>morse encoder</strong>.
                      </p>
                  </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Features</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Use the <strong>morse decoder</strong> to translate secret messages or learn the alphabet. It supports all standard alphanumeric characters. Whether you need a <strong>translate to morse</strong> tool for a puzzle or a <strong>morse code online</strong> utility for ham radio practice, this tool is accurate and instant.
                  </p>
              </div>
              <KeywordsBox keywords={['morse code translator', 'text to morse code', 'morse code decoder', 'morse code generator', 'translate morse code', 'sos morse code', 'international morse code', 'dots and dashes', 'audio signal code', 'telegraph code', 'morse decoder', 'morse encoder', 'morse code converter', 'translate to morse', 'morse code online']} />
          </>
      );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                <label className="block text-sm font-bold mb-2 dark:text-white">Input</label>
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-40 p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:text-white font-mono text-sm resize-none"
                    placeholder={tool.id === ToolID.MORSE_CODE_GENERATOR ? "Enter text to convert to Morse..." : "Enter text or Morse code (e.g., ... --- ...)"}
                />
            </div>
            <div className="flex flex-col justify-center gap-4">
                <button onClick={handleConvert} className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">
                    {tool.id === ToolID.MORSE_CODE_GENERATOR ? 'Generate Morse' : 'Translate'}
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
