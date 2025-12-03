
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

export const CoinFlipTool: React.FC<Props> = ({ tool }) => {
  const [numCoins, setNumCoins] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [counts, setCounts] = useState({ heads: 0, tails: 0 });

  const flip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResults([]); // Clear previous results immediately for animation reset

    setTimeout(() => {
        const newResults = [];
        let h = 0;
        let t = 0;
        for (let i = 0; i < numCoins; i++) {
            const isHeads = Math.random() > 0.5;
            if (isHeads) h++; else t++;
            newResults.push(isHeads ? 'HEADS' : 'TAILS');
        }
        setResults(newResults);
        setCounts({ heads: h, tails: t });
        setIsFlipping(false);
    }, 1000); // Animation duration
  };

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8">
      
      {/* Coin Display Area */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-12 min-h-[300px] flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-8">
              {Array.from({ length: numCoins }).map((_, idx) => (
                  <div key={idx} className="w-32 h-32 relative perspective-1000">
                      <div className={`w-full h-full relative transition-transform duration-1000 transform-style-3d ${isFlipping ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}>
                          {/* We show a placeholder or the result */}
                          <div className={`w-full h-full rounded-full border-4 flex items-center justify-center shadow-xl
                              ${!isFlipping && results[idx] === 'TAILS' 
                                  ? 'bg-gray-200 border-gray-400 text-gray-600' // Silver/Tails
                                  : 'bg-yellow-400 border-yellow-600 text-yellow-800' // Gold/Heads (Default)
                              }
                          `}>
                              <span className="text-4xl font-bold">
                                  {isFlipping ? '?' : results[idx] === 'TAILS' ? 'T' : 'H'}
                              </span>
                              {/* Decorative ring */}
                              <div className="absolute inset-2 border-2 border-dashed border-opacity-50 rounded-full"></div>
                          </div>
                      </div>
                      {!isFlipping && results[idx] && (
                          <div className="mt-4 font-bold text-gray-700 dark:text-gray-300 animate-fadeIn">
                              {results[idx]}
                          </div>
                      )}
                  </div>
              ))}
          </div>

          {!isFlipping && results.length > 0 && (
              <div className="mt-12 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg inline-flex gap-8 border border-gray-200 dark:border-slate-700">
                  <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{counts.heads}</div>
                      <div className="text-xs uppercase font-bold text-gray-500 tracking-wider">Heads</div>
                  </div>
                  <div className="w-px bg-gray-300 dark:bg-slate-700"></div>
                  <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">{counts.tails}</div>
                      <div className="text-xs uppercase font-bold text-gray-500 tracking-wider">Tails</div>
                  </div>
              </div>
          )}
      </div>

      {/* Controls */}
      <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-700 max-w-lg mx-auto">
          <div className="flex flex-col gap-6">
              <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Number of Coins</label>
                  <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-slate-700">
                      {[1, 2, 3].map(n => (
                          <button
                              key={n}
                              onClick={() => { setNumCoins(n); setResults([]); }}
                              className={`flex-1 py-2 rounded-md font-medium transition-all ${numCoins === n ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                          >
                              {n}
                          </button>
                      ))}
                  </div>
              </div>

              <button 
                  onClick={flip}
                  disabled={isFlipping}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
              >
                  {isFlipping ? 'Flipping...' : 'FLIP COIN'}
              </button>
          </div>
      </div>

      {/* NEW SEO CONTENT SECTION */}
      <div className="mt-16 text-left prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Online Coin Flipper Simulator</h2>
          <div className="grid md:grid-cols-2 gap-12">
              <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Virtual Heads or Tails</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Don't have a coin in your pocket? No problem. Our <strong>coin flipper</strong> acts as a <strong>virtual coin</strong> that allows you to settle disputes, make binary decisions, or play probability games instantly. Whether you call it <strong>heads or tails</strong>, a <strong>coin toss</strong>, or a <strong>coin flip</strong>, the result is a classic 50/50 chance.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      You can flip up to 3 coins simultaneously using our <strong>multi dice roller</strong> style interface but for coins. This is perfect for games that require multiple random binary outcomes or for teaching statistical probability concepts in a classroom setting. It essentially functions as a <strong>binary randomizer</strong> or a <strong>heads or tails generator</strong>.
                  </p>
              </div>
              <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Is it Truly Random?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Yes. We use standard pseudo-random number generation (PRNG) algorithms to ensure that every <strong>random coin flip</strong> has exactly a 50/50 chance of landing on Heads or Tails. There is no bias in our code, providing a <strong>fair coin flip</strong> every time.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      Unlike physical coins, which can be biased by weight distribution, air resistance, or the thrower's technique, our <strong>digital coin flip</strong> removes all external variables. This makes it an ideal <strong>probability simulator</strong> for fair decision making. Use it to <strong>flip a coin online</strong> anytime you need an unbiased <strong>head or tail</strong> result.
                  </p>
              </div>
          </div>
          <KeywordsBox keywords={['flip a coin', 'heads or tails', 'coin flipper', 'coin toss', 'random coin flip', 'probability simulator', 'virtual coin', 'head or tail', 'flip coin online', 'binary randomizer', 'coin toss online', 'random heads tails', 'fair coin flip', 'coin flip simulator', 'heads or tails generator', 'virtual coin toss', 'online coin flipper', 'random coin toss', 'flip a coin online', 'coin flipping app', 'heads and tails game', 'randomizer coin', 'binary decision maker', 'simulate coin flip', 'probability coin toss', 'digital coin flip']} />
      </div>
    </div>
  );
};
