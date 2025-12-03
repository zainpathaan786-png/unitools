
import React, { useState } from 'react';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

const ANIMALS = [
    { name: "Monkey", icon: "🐒", traits: "Witty, intelligent, ambitious, and adventurous." },
    { name: "Rooster", icon: "🐓", traits: "Observant, hardworking, courageous, and talented." },
    { name: "Dog", icon: "🐕", traits: "Loyal, honest, amiable, and kind." },
    { name: "Pig", icon: "🐖", traits: "Diligent, compassionate, and generous." },
    { name: "Rat", icon: "🐀", traits: "Quick-witted, resourceful, and versatile." },
    { name: "Ox", icon: "🐂", traits: "Diligent, dependable, strong, and determined." },
    { name: "Tiger", icon: "🐅", traits: "Brave, competitive, unpredictable, and confident." },
    { name: "Rabbit", icon: "🐇", traits: "Gentle, quiet, elegant, and alert." },
    { name: "Dragon", icon: "🐉", traits: "Confident, intelligent, and enthusiastic." },
    { name: "Snake", icon: "🐍", traits: "Enigmatic, intelligent, and wise." },
    { name: "Horse", icon: "🐎", traits: "Animated, active, and energetic." },
    { name: "Goat", icon: "🐐", traits: "Calm, gentle, and sympathetic." },
];

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

export const ZodiacTool: React.FC<Props> = ({ tool }) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [result, setResult] = useState<any>(null);

  const calculateZodiac = () => {
      // 1900 was Year of the Rat. 1900 % 12 = 4. 
      // Rat index in array is 4? No.
      // Let's use standard modulo.
      // Monkey is 0 in my array. 2016 was Monkey. 2016 % 12 = 0.
      // Perfect. Array aligns with Year % 12.
      const index = year % 12;
      setResult(ANIMALS[index]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8 text-center">
          <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Select Birth Year</label>
          <div className="flex justify-center gap-4 mb-8">
              <input 
                  type="number" 
                  value={year} 
                  onChange={(e) => setYear(parseInt(e.target.value) || 0)} 
                  className="w-40 p-4 text-center text-2xl font-bold border border-gray-300 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white"
              />
          </div>
          <button onClick={calculateZodiac} className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-md">Find Zodiac</button>

          {result && (
              <div className="mt-12 animate-popIn">
                  <div className="text-9xl mb-6">{result.icon}</div>
                  <h2 className="text-4xl font-extrabold text-red-600 dark:text-red-400 mb-2">Year of the {result.name}</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 italic">"{result.traits}"</p>
              </div>
          )}
      </div>
      
      <div className="mt-8 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Chinese Zodiac Calculator</h2>
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Ancient Wisdom</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    The Chinese Zodiac, known as <strong>Sheng Xiao</strong>, is an ancient classification system based on a twelve-year cycle. Unlike Western astrology which uses months, the <strong>chinese astrology</strong> system assigns an animal and its reputed attributes to each year. This cycle includes the Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. It is calculated according to the traditional Chinese lunar calendar.
                </p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Find Your Sign</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Your <strong>Chinese birth sign</strong> is derived directly from your birth year. It is believed to influence your personality, career path, relationship compatibility, and fortune. For example, people born in the <strong>Year of the Dragon</strong> are said to be confident and intelligent, while those born in the Year of the Rabbit are gentle and elegant. Use our <strong>zodiac sign calculator</strong> to find your <strong>birth year animal</strong> and associated traits instantly.
                </p>
            </div>
        </div>
        <KeywordsBox keywords={['chinese zodiac calculator', 'chinese new year animal', 'birth year animal', 'zodiac sign calculator', 'sheng xiao', 'lunar new year zodiac', 'year of the dragon', 'chinese astrology', 'chinese horoscope', 'animal sign calculator', 'year of the rabbit traits', 'chinese birth sign', 'find my chinese zodiac', 'chinese zodiac sign finder', 'lunar zodiac calculator', 'chinese animal sign', 'zodiac animal by year', 'chinese astrology calculator', 'birth year zodiac', 'chinese zodiac traits', '12 chinese zodiac animals', 'chinese horoscope sign']} />
      </div>
    </div>
  );
};
