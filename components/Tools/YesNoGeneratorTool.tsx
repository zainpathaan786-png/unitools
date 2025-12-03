
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

export const YesNoGeneratorTool: React.FC<Props> = ({ tool }) => {
  const [result, setResult] = useState<string | null>(null);
  const [includeMaybe, setIncludeMaybe] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const decide = () => {
    setIsThinking(true);
    setResult(null);
    
    // Simulate thinking time
    setTimeout(() => {
        const options = ['YES', 'NO'];
        if (includeMaybe) options.push('MAYBE');
        
        const random = Math.floor(Math.random() * options.length);
        setResult(options[random]);
        setIsThinking(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-12 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Animated Background Blob */}
          <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 transition-colors duration-500
              ${isThinking ? 'bg-blue-400 animate-pulse' : 
                result === 'YES' ? 'bg-green-500' : 
                result === 'NO' ? 'bg-red-500' : 
                result === 'MAYBE' ? 'bg-yellow-500' : 'bg-gray-200 dark:bg-gray-700'}
          `}></div>

          <div className="relative z-10 w-full">
              {isThinking ? (
                  <div className="text-4xl font-bold text-gray-400 animate-bounce">Thinking...</div>
              ) : result ? (
                  <div className="animate-popIn">
                      <h2 className={`text-8xl font-black tracking-tighter mb-4
                          ${result === 'YES' ? 'text-green-600 dark:text-green-400' : 
                            result === 'NO' ? 'text-red-600 dark:text-red-400' : 
                            'text-yellow-500'}
                      `}>
                          {result}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 text-lg">The universe has spoken.</p>
                  </div>
              ) : (
                  <div>
                      <div className="text-6xl mb-6">🔮</div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Need a decision?</h3>
                      <p className="text-gray-500 dark:text-gray-400">Click the button below to decide your fate.</p>
                  </div>
              )}
          </div>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer select-none bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-slate-600">
                  <input 
                      type="checkbox" 
                      checked={includeMaybe} 
                      onChange={(e) => setIncludeMaybe(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">Allow "Maybe"</span>
              </label>

              <button 
                  onClick={decide}
                  disabled={isThinking}
                  className="w-full max-w-xs bg-blue-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
              >
                  {isThinking ? 'Deciding...' : 'DECIDE'}
              </button>
          </div>
      </div>

      {/* NEW SEO CONTENT SECTION */}
      <div className="mt-16 text-left prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Random Yes or No Generator</h2>
          <div className="grid md:grid-cols-2 gap-12">
              <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Decision Fatigue?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Sometimes the hardest part of the day is making small, inconsequential decisions. Should you order pizza? Should you go for that run? Should you buy that item? Decision fatigue is real, and overanalyzing simple choices can drain your mental energy.
                      Let our <strong>Yes or No Generator</strong> take the burden off your shoulders. It acts as an unbiased <strong>decision maker</strong> and digital <strong>oracle</strong>. By clicking a single button, you receive an instant answer derived from a cryptographically secure pseudo-random number generator. It serves as a <strong>quick decision maker</strong> or <strong>random picker</strong> for your everyday dilemmas, similar to a <strong>yes no wheel</strong> or <strong>tarot yes no</strong> reading but much faster.
                  </p>
              </div>
              <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">The "Maybe" Option</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Life isn't always black and white. By enabling the "Allow Maybe" feature, you introduce a third variable into the equation, transforming the tool into a <strong>yes no maybe</strong> generator. 
                      This creates a <strong>random answer</strong> that accounts for uncertainty. This feature is perfect for situations where you might want to delay a decision, look for a compromise, or leave the door open for other possibilities. It adds a realistic layer of complexity to your <strong>random decision</strong> process, functioning like a <strong>decision roulette</strong> or <strong>random choice generator</strong>. Whether you ask <strong>should i do it</strong> or use it as a <strong>fate decider</strong>, this tool provides the clarity you need.
                  </p>
              </div>
          </div>
          <KeywordsBox keywords={['yes or no generator', 'decision maker', 'yes no wheel', 'random answer', 'oracle', 'should i do it', 'yes no maybe', 'random decision', 'tarot yes no', 'random picker', 'daily decision', 'yes no button', 'quick decision maker', 'random yes or no', 'yes no spinner', 'random choice generator', 'decision helper', 'fate decider', 'yes or no questions', 'random answer generator', 'maybe generator', 'decision roulette', 'online oracle', 'indecisive help', 'random yes no picker', 'decision generator']} />
      </div>
    </div>
  );
};
