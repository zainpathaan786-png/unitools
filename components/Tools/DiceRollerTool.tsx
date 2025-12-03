
import React, { useState } from 'react';
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

export const DiceRollerTool: React.FC<Props> = ({ tool }) => {
  const [numDice, setNumDice] = useState(1);
  const [results, setResults] = useState<number[]>([1]); // Default start
  const [isRolling, setIsRolling] = useState(false);
  const [total, setTotal] = useState(1);

  const roll = () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Quick shuffling animation effect
    const interval = setInterval(() => {
        setResults(prev => prev.map(() => Math.floor(Math.random() * 6) + 1));
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        const newResults = [];
        let t = 0;
        for (let i = 0; i < numDice; i++) {
            const val = Math.floor(Math.random() * 6) + 1;
            newResults.push(val);
            t += val;
        }
        setResults(newResults);
        setTotal(t);
        setIsRolling(false);
    }, 1000);
  };

  // Helper to render dots on a die
  const renderDieFace = (val: number) => {
      // Positions for dots based on value
      // Using a 3x3 grid logic: 
      // 1 2 3
      // 4 5 6
      // 7 8 9
      const dotMap: Record<number, number[]> = {
          1: [5],
          2: [3, 7],
          3: [3, 5, 7],
          4: [1, 3, 7, 9],
          5: [1, 3, 5, 7, 9],
          6: [1, 3, 4, 6, 7, 9]
      };
      
      const dots = dotMap[val] || [];

      return (
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-2">
              {[1,2,3,4,5,6,7,8,9].map(pos => (
                  <div key={pos} className="flex items-center justify-center">
                      {dots.includes(pos) && (
                          <div className="w-full h-full bg-black dark:bg-white rounded-full shadow-inner"></div>
                      )}
                  </div>
              ))}
          </div>
      );
  };

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8">
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-12 min-h-[350px] flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-12 mb-8">
              {/* Ensure we map based on current selection logic or existing result length during init */}
              {(isRolling ? Array.from({length: numDice}).map(() => Math.floor(Math.random()*6)+1) : results).map((val, idx) => (
                  <div key={idx} className={`w-24 h-24 bg-white dark:bg-slate-700 rounded-xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] border-2 border-gray-200 dark:border-slate-600 transition-transform duration-100 ${isRolling ? 'animate-bounce' : ''}`}>
                      {renderDieFace(val)}
                  </div>
              ))}
          </div>

          {!isRolling && (
              <div className="animate-fadeIn">
                  <div className="text-gray-500 dark:text-gray-400 text-sm uppercase font-bold tracking-widest mb-1">Total</div>
                  <div className="text-5xl font-black text-gray-800 dark:text-white">{total}</div>
              </div>
          )}
      </div>

      <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 max-w-lg mx-auto">
          <div className="flex flex-col gap-6">
              <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Number of Dice</label>
                  <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-slate-700">
                      <button
                          onClick={() => { setNumDice(1); setResults([1]); setTotal(1); }}
                          className={`flex-1 py-2 rounded-md font-medium transition-all ${numDice === 1 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                      >
                          1 Die
                      </button>
                      <button
                          onClick={() => { setNumDice(2); setResults([1, 1]); setTotal(2); }}
                          className={`flex-1 py-2 rounded-md font-medium transition-all ${numDice === 2 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                      >
                          2 Dice
                      </button>
                  </div>
              </div>

              <button 
                  onClick={roll}
                  disabled={isRolling}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
              >
                  {isRolling ? 'Rolling...' : 'ROLL DICE'}
              </button>
          </div>
      </div>

      {/* NEW SEO CONTENT SECTION */}
      <div className="mt-16 text-left prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Virtual Dice Roller Online</h2>
          <div className="grid md:grid-cols-2 gap-12">
              <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Board Games & RPGs</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Lost your dice under the sofa? No problem. Our <strong>virtual dice roller</strong> acts as a perfect replacement for physical dice. You can <strong>roll dice</strong> instantly for board games like <strong>monopoly dice</strong>, Risk, <strong>yahtzee dice</strong>, or simple tabletop RPG scenarios where physical dice aren't available. 
                      You can choose to <strong>roll a die</strong> (single) or roll two dice simultaneously, making it a versatile <strong>dice simulator</strong> for various gaming needs. It serves as a reliable <strong>online dice</strong> solution that is always accessible from your phone or computer.
                  </p>
              </div>
              <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Statistics & Probability</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Dice are the classic example for teaching <strong>dice probability</strong>. With a single die, every number (1-6) has an equal 16.6% chance of appearing. However, when you use our <strong>dice roller</strong> for two dice, the results follow a bell curve distribution. 
                      For example, 7 is the most likely sum (16.6% chance), while 2 and 12 are the least likely (2.7% chance). This tool is great for demonstrating these mathematical concepts or acting as a <strong>random dice</strong> generator for educational purposes. It functions as a <strong>d6 roller</strong> and general <strong>random dice generator</strong>.
                  </p>
              </div>
          </div>
          <KeywordsBox keywords={['roll dice', 'dice roller', 'virtual dice', 'd6 roller', 'random dice', 'board game dice', 'online dice', 'multiple dice', 'dice simulator', 'roll a die', 'yahtzee dice', 'monopoly dice', 'dice probability', 'online dice roller', 'roll virtual dice', 'random dice generator', 'die roller', 'roll the dice online', 'dice thrower', 'virtual d6', 'random number cubes', 'dice rolling app', 'generate dice roll', 'multi dice roller', 'dice game tool', 'probability of dice']} />
      </div>
    </div>
  );
};
