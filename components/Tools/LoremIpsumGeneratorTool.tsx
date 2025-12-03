
import React, { useState, useEffect, useRef } from 'react';
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

// --- Local Generator Logic (VOCAB and RNG classes kept same) ---
const VOCAB: Record<string, string[]> = {
  'classic-latin': [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
    "sed", "ut", "perspiciatis", "unde", "omnis", "iste", "natus", "error", "sit", "voluptatem", "accusantium", "doloremque", "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis", "et", "quasi", "architecto", "beatae", "vitae", "dicta", "sunt", "explicabo", "nemo", "enim", "ipsam", "voluptatem", "quia", "voluptas", "sit", "aspernatur", "aut", "odit", "aut", "fugit"
  ],
  'en': [
    "the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog", "sky", "is", "blue", "sun", "bright", "today", "beautiful", "day", "learning", "code", "fun", "creative", "logic", "system", "computer", "internet", "world", "people", "history", "way", "art", "information", "map", "two", "family", "government", "health", "system", "computer", "meat", "year", "thanks", "music", "person", "reading", "method", "data", "food", "understanding", "theory", "law", "bird", "literature", "problem", "software", "control", "knowledge", "power", "ability", "economics", "love", "television", "science", "library", "nature", "fact", "product", "idea", "temperature", "investment", "area", "society", "activity", "story", "industry", "media", "thing", "oven", "community", "definition", "safety", "quality", "development", "language", "management", "player", "variety", "video", "week", "security", "country", "exam", "movie", "organization", "equipment", "physics", "analysis", "policy", "series", "thought", "basis", "boyfriend", "direction", "strategy", "technology", "army", "camera", "freedom", "paper", "environment", "child", "instance", "month", "truth", "marketing", "university", "writing", "article", "department", "difference", "goal", "news", "audience", "fishing", "growth", "income"
  ],
  'corporate': [
    "synergy", "leverage", "paradigm", "shift", "touchbase", "circle", "back", "bandwidth", "deliverables", "action", "items", "low-hanging", "fruit", "drill", "down", "verticals", "holistic", "approach", "value-add", "proposition", "stakeholder", "engagement", "roadmap", "milestone", "best", "practices", "innovate", "disrupt", "agile", "workflow", "scalability", "robust", "solutions", "enterprise", "integration", "strategic", "alignment", "core", "competency", "market", "penetration", "thought", "leadership", "ecosystem", "optimization", "metrics", "KPIs", "ROI", "bottom", "line", "quarterly", "review", "assets", "liabilities", "growth", "hacking", "onboarding", "retention", "churn", "blue", "sky", "thinking", "out", "of", "the", "box", "ping", "offline", "hard", "stop", "moving", "forward", "pain", "points", "wheelhouse", "game", "changer"
  ],
  'tech': [
    "algorithm", "bandwidth", "cloud", "data", "encryption", "firewall", "gigabyte", "hardware", "interface", "javascript", "keyboard", "latency", "malware", "network", "offline", "protocol", "quantum", "router", "server", "terabyte", "user", "virtual", "wireless", "xml", "zip", "backend", "frontend", "fullstack", "devops", "container", "microservices", "blockchain", "artificial", "intelligence", "machine", "learning", "neural", "network", "cybersecurity", "exploit", "patch", "update", "repository", "commit", "push", "pull", "merge", "conflict", "branch", "master", "main", "stack", "trace", "debug", "compile", "runtime", "latency", "throughput", "bandwidth", "api", "endpoint", "json", "rest", "graphql", "database", "sql", "nosql", "cache", "cookie", "session", "authentication", "authorization", "docker", "kubernetes", "serverless", "lambda"
  ],
  'hipster': [
    "succulents", "kombucha", "kale", "chips", "biodiesel", "quinoa", "artisan", "pour-over", "coffee", "selvedge", "raw", "denim", "tote", "bag", "microdosing", "aesthetic", "vinyl", "record", "player", "mustache", "beard", "oil", "fixed", "gear", "bicycle", "sustainable", "farm-to-table", "organic", "gluten-free", "vegan", "tacos", "craft", "beer", "IPA", "subway", "tile", "exposed", "brick", "mason", "jar", "brunch", "avocado", "toast", "cold-pressed", "juice", "meditation", "yoga", "mat", "plaid", "flannel", "shirt", "beanie", "typewriter", "messenger", "bag", "bespoke", "curated", "small", "batch", "heirloom", "gastropub", "lo-fi", "chillwave", "synth", "pop", "retro", "vintage", "vaporware"
  ],
  'funny': [
    "bazinga", "flibbertigibbet", "shenanigans", "bamboozled", "gobbledygook", "lollygag", "kerfuffle", "skedaddle", "malarkey", "nincompoop", "doohickey", "thingamajig", "whatchamacallit", "discombobulate", "cantankerous", "cat", "pyjamas", "bee's", "knees", "hanky", "panky", "willy-nilly", "higgedly-piggedly", "hullabaloo", "ragamuffin", "scallywag", "whippersnapper", "gobsmacked", "flummoxed", "hornswoggle", "bodacious", "gnarly", "tubular", "radical", "cowabunga", "bananas", "bonkers", "cheeseburger", "noodle", "spatula", "waddle", "wobble", "zing", "zowie", "blimp", "bubble", "squeak", "squish", "splat", "yeet", "yoink", "zoinks"
  ]
};

// Seeded Random Number Generator
class RNG {
    private seed: number;
    constructor(seedStr: string) {
        let h = 2166136261 >>> 0;
        if (seedStr) {
            for (let i = 0; i < seedStr.length; i++) {
                h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
            }
        } else {
            h = Math.floor(Math.random() * 2147483647);
        }
        this.seed = h;
    }

    next(): number {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    range(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    pickOne<T>(arr: T[]): T {
        return arr[this.range(0, arr.length - 1)];
    }
    
    chance(probability: number): boolean {
        return this.next() < probability;
    }
}

export const LoremIpsumGeneratorTool: React.FC<Props> = ({ tool }) => {
  // Configuration State
  const [mode, setMode] = useState<'plain' | 'html' | 'markdown'>('plain');
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words' | 'lists' | 'headings' | 'json' | 'sql' | 'emails' | 'heading_paragraphs'>('paragraphs');
  const [count, setCount] = useState(3);
  const [complexity, setComplexity] = useState<'short' | 'mixed' | 'long'>('mixed');
  const [languageVariant, setLanguageVariant] = useState<string>('classic-latin');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [seed, setSeed] = useState('');
  
  // Output State
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Initial Generation Only
  useEffect(() => {
    handleGenerate();
  }, [tool.id]);

  const generateLocalText = () => {
      const rng = new RNG(seed || Date.now().toString());
      const vocabKey = languageVariant;
      let vocab = VOCAB[vocabKey] || VOCAB['classic-latin'];

      // Sentence Length Logic
      const getSentenceLength = () => {
          if (complexity === 'short') return rng.range(4, 8);
          if (complexity === 'long') return rng.range(15, 25);
          return rng.range(8, 15); // mixed
      };

      const getParagraphLength = () => {
          if (complexity === 'short') return rng.range(3, 5); 
          if (complexity === 'long') return rng.range(6, 10);
          return rng.range(4, 7);
      };

      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
      const toTitleCase = (str: string) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

      const generateWord = () => rng.pickOne(vocab);

      const generateSentence = (wordCount: number, isFirstSentence = false, noPunctuation = false) => {
          const words = [];
          
          // "Lorem ipsum..." logic
          if (isFirstSentence && startWithLorem && (vocabKey === 'classic-latin')) {
              const starter = ["Lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit"];
              const take = Math.min(wordCount, starter.length);
              words.push(...starter.slice(0, take));
              for (let i = take; i < wordCount; i++) words.push(rng.pickOne(vocab));
          } else {
              for (let i = 0; i < wordCount; i++) words.push(rng.pickOne(vocab));
          }

          // Add commas for flow
          if (wordCount > 7 && !noPunctuation) {
              const commaPos = rng.range(3, wordCount - 3);
              if (words[commaPos] && !words[commaPos].includes(',')) {
                  words[commaPos] += ',';
              }
          }

          let sent = words.join(' ');
          
          if (!startWithLorem || !isFirstSentence || vocabKey !== 'classic-latin') {
              sent = capitalize(sent);
          }
          
          if (sent.endsWith(',')) sent = sent.slice(0, -1);
          
          return sent + (noPunctuation ? '' : '.');
      };

      const generateParagraph = (numSentences: number, isFirstParagraph = false) => {
          const sents = [];
          for (let i = 0; i < numSentences; i++) {
              sents.push(generateSentence(getSentenceLength(), isFirstParagraph && i === 0));
          }
          return sents.join(' ');
      };

      let finalString = "";

      // --- LOGIC SWITCH BASED ON TYPE ---

      if (type === 'json') {
          // JSON Generation
          const items = [];
          for (let i = 0; i < count; i++) {
              items.push({
                  id: i + 1,
                  title: toTitleCase(generateSentence(rng.range(3, 6), false, true)),
                  body: generateSentence(rng.range(8, 15)),
                  active: rng.chance(0.8),
                  tags: [generateWord(), generateWord()]
              });
          }
          // Wrap based on mode
          const jsonStr = JSON.stringify(items, null, 2);
          if (mode === 'html') finalString = `<pre><code>${jsonStr}</code></pre>`;
          else if (mode === 'markdown') finalString = "```json\n" + jsonStr + "\n```";
          else finalString = jsonStr;
      
      } else if (type === 'sql') {
          // SQL Generation
          const rows = [];
          const table = generateWord() + "_table";
          for (let i = 0; i < count; i++) {
              const title = toTitleCase(generateSentence(rng.range(3, 6), false, true));
              const body = generateSentence(rng.range(8, 15));
              rows.push(`INSERT INTO ${table} (id, title, content) VALUES (${i+1}, '${title}', '${body}');`);
          }
          const sqlStr = rows.join('\n');
          if (mode === 'html') finalString = `<pre><code>${sqlStr}</code></pre>`;
          else if (mode === 'markdown') finalString = "```sql\n" + sqlStr + "\n```";
          else finalString = sqlStr;

      } else if (type === 'emails') {
          // Email Generation
          const emails = [];
          for (let i = 0; i < count; i++) {
              const user = generateWord();
              const domain = generateWord();
              const ext = rng.pickOne(['com', 'net', 'org', 'io', 'co']);
              emails.push(`${user}.${domain}@example.${ext}`);
          }
          
          if (mode === 'html') finalString = `<ul>\n${emails.map(e => `  <li><a href="mailto:${e}">${e}</a></li>`).join('\n')}\n</ul>`;
          else if (mode === 'markdown') finalString = emails.map(e => `- [${e}](mailto:${e})`).join('\n');
          else finalString = emails.join('\n');

      } else if (type === 'headings') {
          // Headings Generation
          const headings = [];
          for (let i = 0; i < count; i++) {
              headings.push(toTitleCase(generateSentence(rng.range(2, 6), false, true)));
          }

          if (mode === 'html') finalString = headings.map(h => `<h2>${h}</h2>`).join('\n');
          else if (mode === 'markdown') finalString = headings.map(h => `## ${h}`).join('\n');
          else finalString = headings.join('\n');

      } else if (type === 'heading_paragraphs') {
          // Heading + Paragraphs
          const blocks = [];
          for (let i = 0; i < count; i++) {
              const heading = toTitleCase(generateSentence(rng.range(3, 7), false, true));
              // Generate 1 to 3 paragraphs per heading
              const paraCount = rng.range(1, 3);
              const paras = [];
              for(let j=0; j<paraCount; j++) {
                  // Only start with Lorem if it's the very first paragraph of the very first block
                  const isStart = (i === 0 && j === 0);
                  paras.push(generateParagraph(getParagraphLength(), isStart));
              }

              if (mode === 'html') {
                  blocks.push(`<h2>${heading}</h2>\n${paras.map(p => `<p>${p}</p>`).join('\n')}`);
              } else if (mode === 'markdown') {
                  blocks.push(`## ${heading}\n\n${paras.join('\n\n')}`);
              } else {
                  blocks.push(`${heading.toUpperCase()}\n\n${paras.join('\n\n')}`);
              }
          }
          finalString = blocks.join('\n\n');

      } else {
          // Standard Text (Words, Sentences, Paragraphs, Lists)
          let outputParts: string[] = [];

          if (type === 'words') {
              for (let i = 0; i < count; i++) outputParts.push(rng.pickOne(vocab));
              if (startWithLorem && vocabKey === 'classic-latin' && count >= 2) {
                  outputParts[0] = "Lorem";
                  outputParts[1] = "ipsum";
              }
          } else if (type === 'sentences') {
              for (let i = 0; i < count; i++) {
                  outputParts.push(generateSentence(getSentenceLength(), i === 0));
              }
          } else if (type === 'lists') {
              for (let i = 0; i < count; i++) {
                  let item = generateSentence(rng.range(3, 8)).slice(0, -1);
                  outputParts.push(item);
              }
          } else {
              // Paragraphs
              for (let i = 0; i < count; i++) {
                  outputParts.push(generateParagraph(getParagraphLength(), i === 0));
              }
          }

          // Formatting for Standard Text
          if (mode === 'html') {
              if (type === 'lists') {
                  finalString = `<ul>\n${outputParts.map(item => `  <li>${item}</li>`).join('\n')}\n</ul>`;
              } else if (type === 'paragraphs') {
                  finalString = outputParts.map(p => `<p>${p}</p>`).join('\n\n');
              } else {
                  finalString = `<p>${outputParts.join(' ')}</p>`;
              }
          } 
          else if (mode === 'markdown') {
              if (type === 'lists') {
                  finalString = outputParts.map(item => `- ${item}`).join('\n');
              } else if (type === 'paragraphs') {
                  finalString = outputParts.join('\n\n');
              } else {
                  finalString = outputParts.join(' ');
              }
          } 
          else {
              // Plain
              if (type === 'lists') {
                  finalString = outputParts.map(item => `• ${item}`).join('\n');
              } else if (type === 'paragraphs') {
                  finalString = outputParts.join('\n\n');
              } else {
                  finalString = outputParts.join(' ');
              }
          }
      }

      setResult(finalString);
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
        generateLocalText();
        setLoading(false);
    }, 100);
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
      let ext = 'txt';
      let mime = 'text/plain';
      
      if (mode === 'html') { ext = 'html'; mime = 'text/html'; }
      if (mode === 'markdown') { ext = 'md'; mime = 'text/markdown'; }
      if (type === 'json') { ext = 'json'; mime = 'application/json'; }
      if (type === 'sql') { ext = 'sql'; mime = 'text/plain'; }
      
      download(result, `lorem_ipsum_${Date.now()}.${ext}`, mime);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Controls */}
        <div className="lg:w-1/3 space-y-6">
            {/* ... (Controls UI remains the same) ... */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/30">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                        Generator Settings
                    </h3>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Structure */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">What to generate?</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-1">
                                <select 
                                    value={type} 
                                    onChange={(e) => setType(e.target.value as any)} 
                                    className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <optgroup label="Standard Text">
                                        <option value="paragraphs">Paragraphs</option>
                                        <option value="sentences">Sentences</option>
                                        <option value="words">Words</option>
                                        <option value="headings">Headings</option>
                                        <option value="heading_paragraphs">Heading + Paragraphs</option>
                                        <option value="lists">List Items</option>
                                    </optgroup>
                                    <optgroup label="Code & Data">
                                        <option value="json">JSON Data</option>
                                        <option value="sql">SQL Query</option>
                                        <option value="emails">Emails</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <input 
                                    type="number" 
                                    min="1" max="100" 
                                    value={count} 
                                    onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} 
                                    className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Style */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Style & Vocabulary</label>
                        <select 
                            value={languageVariant} 
                            onChange={(e) => setLanguageVariant(e.target.value)} 
                            className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="classic-latin">Classic Latin (Lorem Ipsum)</option>
                            <option value="en">Modern English</option>
                            <option value="corporate">Corporate Speak</option>
                            <option value="tech">Tech Jargon</option>
                            <option value="hipster">Hipster</option>
                            <option value="funny">Funny / Random</option>
                        </select>
                        
                        {languageVariant === 'classic-latin' && (type === 'paragraphs' || type === 'words' || type === 'sentences' || type === 'heading_paragraphs') && (
                            <div className="mt-3 flex items-center">
                                <input 
                                    id="startWithLorem" 
                                    type="checkbox" 
                                    checked={startWithLorem} 
                                    onChange={(e) => setStartWithLorem(e.target.checked)} 
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                                />
                                <label htmlFor="startWithLorem" className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                    Start with "Lorem ipsum..."
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Complexity - Hidden for simple data types */}
                    {type !== 'json' && type !== 'sql' && type !== 'emails' && type !== 'words' && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sentence Complexity</label>
                            <div className="flex rounded-lg bg-gray-100 dark:bg-slate-700 p-1">
                                {['short', 'mixed', 'long'].map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setComplexity(c as any)}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                                            complexity === c 
                                            ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                        }`}
                                    >
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Output Format */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Format</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['plain', 'html', 'markdown'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m as any)}
                                    className={`py-2 px-2 text-xs font-bold uppercase rounded-lg border transition-all ${
                                        mode === m
                                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {m === 'plain' ? 'Text' : m}
                                </button>
                            ))}
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Generate
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* Right Content: Output */}
        <div className="lg:w-2/3 flex flex-col h-[600px] lg:h-auto min-h-[600px]">
            {/* ... (Output UI remains similar) ... */}
            <div className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col relative group">
                
                {/* Header Bar */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${result ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wider">
                            Generated {mode === 'plain' ? 'Text' : mode === 'html' ? 'HTML' : 'Markdown'}
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
                        className={`w-full h-full p-6 bg-transparent border-none resize-none focus:ring-0 text-gray-800 dark:text-gray-200 leading-relaxed outline-none ${mode === 'plain' ? 'font-serif text-lg' : 'font-mono text-sm'}`}
                        spellCheck={false}
                    />
                    {mode !== 'plain' && (
                        <div className="absolute bottom-4 right-6 pointer-events-none opacity-20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        </div>
                    )}
                </div>
                
                {/* Stats Footer */}
                <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-6 py-3 flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <div>{result.length} Characters</div>
                    <div>{type === 'json' || type === 'sql' ? `${count} Records` : `${result.split(/\s+/).filter(Boolean).length} Words`}</div>
                </div>
            </div>
        </div>

      </div>

      {/* NEW SEO CONTENT SECTION */}
      <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About the Lorem Ipsum Generator</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">What is Lorem Ipsum?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It allows designers to focus on the visual elements of a layout without being distracted by readable content. This <strong>lorem ipsum generator</strong> is essential for layout testing.
                </p>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Why use a Generator?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Using a <strong>dummy text generator</strong> saves time for web designers, graphic artists, and developers. Instead of manually typing gibberish or copying the same sentence repeatedly, our tool creates unique, randomized <strong>placeholder text</strong> in various formats (paragraphs, lists, JSON, SQL) to fit your specific design needs. It helps simulate real content distribution in your mockups.
                </p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Features & Capabilities</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                    <li><strong>Multiple Formats:</strong> Generate standard text, HTML code, Markdown, or data structures like JSON and SQL.</li>
                    <li><strong>Custom Styles:</strong> Choose between Classic Latin, Modern English, Corporate Speak, Tech Jargon, or fun variations like Hipster or Funny text.</li>
                    <li><strong>Flexible Length:</strong> Control the number of paragraphs, sentences, or words generated to fit your layout perfectly.</li>
                    <li><strong>One-Click Export:</strong> Easily copy to clipboard or download the generated text as a file.</li>
                </ul>
            </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">Best Practices for Placeholder Text</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                When designing user interfaces, it is crucial to use realistic content length. Our tool offers 'Short', 'Medium', and 'Long' complexity settings to mimic various content density. This ensures that your design remains robust whether it handles brief headlines or extensive article bodies. Utilizing diverse vocabulary options also prevents the visual pattern recognition that occurs with repetitive <strong>filler text</strong>, giving a more accurate feel of the final product. Use our <strong>generate random text</strong> features for reliable results.
            </p>
        </div>
        
        <KeywordsBox keywords={['lorem ipsum generator', 'dummy text generator', 'placeholder text', 'filler text', 'generate random text', 'web design placeholder', 'lorem ipsum text', 'mock content generator', 'typography testing', 'latin filler', 'lipsum generator', 'generate dummy text', 'random text generator', 'filler text generator', 'lorem ipsum online']} />
      </div>
    </div>
  );
};
