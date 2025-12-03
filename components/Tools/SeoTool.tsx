
import React, { useState, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';

interface Props {
  tool: ToolDefinition;
}

const STOP_WORDS = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", 
    "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", 
    "can't", "cannot", "could", "couldn't", 
    "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", 
    "each", 
    "few", "for", "from", "further", 
    "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", 
    "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", 
    "let's", 
    "me", "more", "most", "mustn't", "my", "myself", 
    "no", "nor", "not", 
    "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", 
    "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", 
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", 
    "under", "until", "up", 
    "very", 
    "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", 
    "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
]);

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

export const SeoTool: React.FC<Props> = ({ tool }) => {
  // Common state
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<any>(null);

  // --- SERP Simulator ---
  const [serpTitle, setSerpTitle] = useState('Example Page Title');
  const [serpDesc, setSerpDesc] = useState('This is an example description for your web page in Google search results.');
  const [serpUrl, setSerpUrl] = useState('www.example.com');

  // --- UTM Link Generator ---
  const [utmUrl, setUtmUrl] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');

  // --- Keyword Permutation ---
  const [permList1, setPermList1] = useState('');
  const [permList2, setPermList2] = useState('');
  const [permList3, setPermList3] = useState('');

  // --- Htaccess Redirect ---
  const [htaccessType, setHtaccessType] = useState('301');
  const [htaccessOld, setHtaccessOld] = useState('');
  const [htaccessNew, setHtaccessNew] = useState('');

  // --- Existing States ---
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [metaAuthor, setMetaAuthor] = useState(''); // Added Author
  const [siteUrl, setSiteUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ogType, setOgType] = useState('website'); // Added OG Type
  
  const [schemaType, setSchemaType] = useState('Article');
  const [schemaName, setSchemaName] = useState('');
  const [schemaAuthor, setSchemaAuthor] = useState('');
  
  const [allowPath, setAllowPath] = useState('/');
  const [disallowPath, setDisallowPath] = useState('/admin');
  
  useEffect(() => {
    // Reset ALL states on tool change
    setInputText('');
    setResult(null);
    setMetaTitle(''); setMetaDesc(''); setMetaKeywords(''); setMetaAuthor('');
    setSiteUrl(''); setImageUrl(''); setOgType('website');
    setSchemaType('Article'); setSchemaName(''); setSchemaAuthor('');
    setAllowPath('/'); setDisallowPath('/admin');
    
    // Reset specific tool defaults
    if (tool.id === ToolID.GOOGLE_SERP_SIMULATOR) {
        setSerpTitle('Example Page Title'); 
        setSerpDesc('This is an example description for your web page in Google search results.'); 
        setSerpUrl('www.example.com');
    } else {
        setSerpTitle(''); setSerpDesc(''); setSerpUrl('');
    }
    
    setUtmUrl(''); setUtmSource(''); setUtmMedium(''); setUtmCampaign(''); setUtmTerm(''); setUtmContent('');
    setPermList1(''); setPermList2(''); setPermList3('');
    setHtaccessType('301'); setHtaccessOld(''); setHtaccessNew('');
  }, [tool.id]);

  const countSyllables = (text: string) => {
      const words: string[] = text.toLowerCase().match(/\b\w+\b/g) || [];
      let count = 0;
      words.forEach(word => {
          word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
          word = word.replace(/^y/, '');
          const matches = word.match(/[aeiouy]{1,2}/g);
          count += matches ? matches.length : 1;
      });
      return count || 1;
  };

  const calculate = () => {
    // --- Existing Text Analysis Tools ---
    if (tool.id === ToolID.CHARACTER_COUNTER) {
        setResult({
            chars: inputText.length,
            charsNoSpace: inputText.replace(/\s/g, '').length,
            words: inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length,
            lines: inputText.split(/\r\n|\r|\n/).length
        });
    }
    else if (tool.id === ToolID.WORD_COUNTER) {
        const words = inputText.trim() === '' ? 0 : inputText.trim().split(/\s+/).length;
        const sentences = inputText.split(/[.!?]+/).filter(Boolean).length;
        const paragraphs = inputText.split(/\n\s*\n/).filter(Boolean).length;
        setResult({ words, sentences, paragraphs });
    }
    else if (tool.id === ToolID.TEXT_STATISTICS) {
        const chars = inputText.length;
        const wordsArr = inputText.trim().split(/\s+/);
        const words = inputText.trim() === '' ? 0 : wordsArr.length;
        const sentences = inputText.split(/[.!?]+/).filter(Boolean).length;
        const paragraphs = inputText.split(/\n\s*\n/).filter(Boolean).length;
        const lines = inputText.split(/\r\n|\r|\n/).length;
        // Approx reading time: 200 words per minute
        const readingTime = Math.ceil(words / 200);
        // Approx speaking time: 130 words per minute
        const speakingTime = Math.ceil(words / 130);
        
        setResult({ chars, words, sentences, paragraphs, lines, readingTime, speakingTime });
    }
    else if (tool.id === ToolID.READABILITY_SCORE) {
        const words = inputText.trim().split(/\s+/).filter(w => w.length > 0).length;
        const sentences = inputText.split(/[.!?]+/).filter(Boolean).length || 1;
        const syllables = countSyllables(inputText);
        const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
        let grade = '';
        if (score >= 90) grade = 'Very Easy'; else if (score >= 60) grade = 'Standard'; else if (score >= 30) grade = 'Difficult'; else grade = 'Very Difficult';
        setResult({ score: score.toFixed(1), grade, words, sentences, syllables });
    }
    else if (tool.id === ToolID.KEYWORD_DENSITY_CHECKER) {
        const words: string[] = inputText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const totalWords = words.length;
        const counts: {[key: string]: number} = {};
        
        words.forEach(w => { 
            // Filter out common stop words and ensure length > 2
            if (!STOP_WORDS.has(w)) {
                counts[w] = (counts[w] || 0) + 1; 
            }
        });
        
        const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15)
            .map(([word, count]) => ({ 
                word, 
                count, 
                density: ((count / totalWords) * 100).toFixed(2) 
            }));
            
        setResult({ totalWords, keywords: sorted });
    }
    else if (tool.id === ToolID.HEADING_TAG_ANALYZER) {
        const h1 = (inputText.match(/<h1[^>]*>.*?<\/h1>/gi) || []).length;
        const h2 = (inputText.match(/<h2[^>]*>.*?<\/h2>/gi) || []).length;
        const h3 = (inputText.match(/<h3[^>]*>.*?<\/h3>/gi) || []).length;
        const h4 = (inputText.match(/<h4[^>]*>.*?<\/h4>/gi) || []).length;
        const h5 = (inputText.match(/<h5[^>]*>.*?<\/h5>/gi) || []).length;
        const h6 = (inputText.match(/<h6[^>]*>.*?<\/h6>/gi) || []).length;
        setResult({ h1, h2, h3, h4, h5, h6 });
    }
    
    // --- New Tools Logic ---
    else if (tool.id === ToolID.HTML_TEXT_RATIO_CALCULATOR) {
        const html = inputText;
        const text = html.replace(/<[^>]*>/g, '').trim();
        const htmlSize = html.length;
        const textSize = text.length;
        if (htmlSize === 0) return;
        const ratio = (textSize / htmlSize) * 100;
        setResult({ htmlSize, textSize, ratio: ratio.toFixed(2) });
    }
    else if (tool.id === ToolID.PPC_KEYWORD_WRAPPER) {
        const keywords = inputText.split('\n').map(k => k.trim()).filter(k => k);
        const broad = keywords.join('\n');
        const phrase = keywords.map(k => `"${k}"`).join('\n');
        const exact = keywords.map(k => `[${k}]`).join('\n');
        setResult({ broad, phrase, exact });
    }
    else if (tool.id === ToolID.BULK_URL_OPENER) {
        const urls = inputText.split('\n').map(u => u.trim()).filter(u => u);
        let openedCount = 0;
        urls.forEach(url => {
            const finalUrl = url.startsWith('http') ? url : `https://${url}`;
            window.open(finalUrl, '_blank');
            openedCount++;
        });
        setResult({ opened: openedCount });
    }
    else if (tool.id === ToolID.LINK_EXTRACTOR) {
        const internal: string[] = [];
        const external: string[] = [];
        const regex = /href=["'](.*?)["']/g;
        let match;
        while ((match = regex.exec(inputText)) !== null) {
            const url = match[1];
            if (url.startsWith('http') || url.startsWith('//')) {
                external.push(url);
            } else {
                internal.push(url);
            }
        }
        setResult({ internal, external });
    }
  };

  const generateCode = () => {
      let code = '';
      
      // Existing Generators
      if (tool.id === ToolID.META_TAG_GENERATOR) {
          code = `<!-- Meta Tags Generated by UniTools -->\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${metaTitle}</title>\n<meta name="title" content="${metaTitle}">\n<meta name="description" content="${metaDesc}">\n<meta name="keywords" content="${metaKeywords}">\n<meta name="author" content="${metaAuthor}">\n<meta name="robots" content="index, follow">\n<meta name="language" content="English">`;
      }
      else if (tool.id === ToolID.OPEN_GRAPH_GENERATOR) {
          code = `<!-- Open Graph / Facebook -->\n<meta property="og:type" content="${ogType}">\n<meta property="og:url" content="${siteUrl}">\n<meta property="og:title" content="${metaTitle}">\n<meta property="og:description" content="${metaDesc}">\n<meta property="og:image" content="${imageUrl}">\n\n<!-- Twitter -->\n<meta property="twitter:card" content="summary_large_image">\n<meta property="twitter:url" content="${siteUrl}">\n<meta property="twitter:title" content="${metaTitle}">\n<meta property="twitter:description" content="${metaDesc}">\n<meta property="twitter:image" content="${imageUrl}">`;
      }
      else if (tool.id === ToolID.ROBOTS_TXT_GENERATOR) {
          let sitemapStr = '';
          if (siteUrl) {
              sitemapStr = siteUrl.endsWith('.xml') ? siteUrl : (siteUrl.endsWith('/') ? `${siteUrl}sitemap.xml` : `${siteUrl}/sitemap.xml`);
          }
          code = `User-agent: *\nDisallow: ${disallowPath}\nAllow: ${allowPath}${sitemapStr ? `\n\nSitemap: ${sitemapStr}` : ''}`;
      }
      else if (tool.id === ToolID.SITEMAP_GENERATOR) {
          code = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n   <url>\n      <loc>${siteUrl || 'https://www.example.com/'}</loc>\n      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n      <changefreq>monthly</changefreq>\n      <priority>1.0</priority>\n   </url>\n</urlset>`;
      }
      else if (tool.id === ToolID.ALT_TEXT_GENERATOR) {
          code = `<img src="${imageUrl || 'image.jpg'}" alt="${inputText}" />`;
      }
      else if (tool.id === ToolID.CANONICAL_TAG_GENERATOR) {
          code = `<link rel="canonical" href="${siteUrl}" />`;
      }
      else if (tool.id === ToolID.SCHEMA_MARKUP_GENERATOR) {
          const schema: any = { "@context": "https://schema.org", "@type": schemaType, "headline": schemaName, "image": imageUrl ? [imageUrl] : undefined, "author": schemaAuthor ? { "@type": "Person", "name": schemaAuthor } : undefined, "datePublished": new Date().toISOString() };
          code = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
      }
      
      // New Generators
      else if (tool.id === ToolID.UTM_LINK_GENERATOR) {
          let url = utmUrl;
          if (url && !url.includes('?')) url += '?';
          else if (url && !url.includes('&') && url.includes('?')) url += '&'; // simplified check
          else if (url && !url.includes('?')) url += '?'; // re-check for empty params case

          const params = [];
          if (utmSource) params.push(`utm_source=${encodeURIComponent(utmSource)}`);
          if (utmMedium) params.push(`utm_medium=${encodeURIComponent(utmMedium)}`);
          if (utmCampaign) params.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`);
          if (utmTerm) params.push(`utm_term=${encodeURIComponent(utmTerm)}`);
          if (utmContent) params.push(`utm_content=${encodeURIComponent(utmContent)}`);
          
          if(url.endsWith('?') || url.endsWith('&')) {
             code = url + params.join('&');
          } else {
             code = url + (url.includes('?') ? '&' : '?') + params.join('&');
          }
      }
      else if (tool.id === ToolID.KEYWORD_PERMUTATION_GENERATOR) {
          const l1 = permList1.split('\n').map(s=>s.trim()).filter(s=>s);
          const l2 = permList2.split('\n').map(s=>s.trim()).filter(s=>s);
          const l3 = permList3.split('\n').map(s=>s.trim()).filter(s=>s);
          const res = [];
          
          // Ensure at least one empty string to allow loops to run if list is empty
          const arr1 = l1.length ? l1 : [''];
          const arr2 = l2.length ? l2 : [''];
          const arr3 = l3.length ? l3 : [''];

          for(const a of arr1) {
              for(const b of arr2) {
                  for(const c of arr3) {
                      const phrase = `${a} ${b} ${c}`.trim().replace(/\s+/g, ' ');
                      if(phrase) res.push(phrase);
                  }
              }
          }
          code = res.join('\n');
      }
      else if (tool.id === ToolID.HTACCESS_REDIRECT_GENERATOR) {
          if (htaccessType === '301') {
              code = `Redirect 301 ${htaccessOld} ${htaccessNew}`;
          } else if (htaccessType === 'www') {
              code = `RewriteEngine On\nRewriteCond %{HTTP_HOST} !^www\\. [NC]\nRewriteRule ^(.*)$ http://www.%{HTTP_HOST}/$1 [R=301,L]`;
          } else if (htaccessType === 'non-www') {
              code = `RewriteEngine On\nRewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]\nRewriteRule ^(.*)$ http://%1/$1 [R=301,L]`;
          } else if (htaccessType === 'https') {
              code = `RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`;
          }
      }

      setResult({ code });
  };

  const getSEOContent = () => {
    switch (tool.id) {
        case ToolID.META_TAG_GENERATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Free Meta Tag Generator</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Meta tags are snippets of text that describe a page's content; the meta tags don't appear on the page itself, but only in the page's source code. 
                        Our <strong>Meta Tag Generator</strong> helps you create SEO-friendly title, description, author, and viewport tags that search engines love.
                    </p>
                    <KeywordsBox keywords={['meta tag generator', 'seo meta tags', 'generate meta description', 'html meta tags', 'seo title generator', 'website metadata tool']} />
                </>
            );
        case ToolID.GOOGLE_SERP_SIMULATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Google SERP Simulator</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Visualize how your website will appear in Google search results. This <strong>SERP Preview Tool</strong> helps you optimize your page title and meta description pixel lengths to prevent truncation.
                        Improve your click-through rate (CTR) by crafting compelling snippets before you publish.
                    </p>
                    <KeywordsBox keywords={['serp simulator', 'google snippet preview', 'seo title length checker', 'meta description length', 'google search preview', 'serp preview tool']} />
                </>
            );
        case ToolID.UTM_LINK_GENERATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">UTM Campaign URL Builder</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Easily add campaign parameters to your URLs so you can track custom campaigns in Google Analytics. 
                        Our <strong>UTM Link Generator</strong> ensures your tracking tags (source, medium, campaign) are formatted correctly.
                    </p>
                    <KeywordsBox keywords={['utm generator', 'campaign url builder', 'google analytics url builder', 'tracking link generator', 'utm builder', 'marketing url builder']} />
                </>
            );
        default:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">SEO & Webmaster Tools</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Explore our comprehensive <strong>seo tools list</strong> designed to boost your website's performance. 
                        Whether you need a <strong>free site audit tool</strong> alternative or <strong>free keyword analysis</strong>, our utilities cover the essentials.
                        We provide tools for <strong>technical SEO</strong>, <strong>content optimization</strong>, and <strong>link building</strong> support.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        From basic <strong>meta tag generators</strong> to advanced <strong>schema markup</strong> creators, our suite offers everything a webmaster needs. These <strong>free seo tools</strong> are designed to run in your browser, providing instant feedback and code generation without expensive subscriptions.
                    </p>
                    <KeywordsBox keywords={['seo tools list', 'webmaster tools', 'free seo utilities', 'site optimization', 'digital marketing tools', 'search engine ranking', 'content analysis', 'technical seo', 'online marketing tools', 'website improvement', 'free seo tools', 'website optimization tools', 'online webmaster tools', 'seo analysis software', 'improve site ranking']} />
                </>
            );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 md:p-8 animate-fadeIn">
        
        {/* --- GOOGLE SERP SIMULATOR --- */}
        {tool.id === ToolID.GOOGLE_SERP_SIMULATOR && (
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300">Enter Details</h3>
                    <div>
                        <label className="text-sm font-semibold dark:text-gray-300">Title Tag</label>
                        <input type="text" value={serpTitle} onChange={e => setSerpTitle(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                        <div className="text-xs text-gray-500 mt-1">{serpTitle.length} / 60 chars</div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold dark:text-gray-300">Meta Description</label>
                        <textarea value={serpDesc} onChange={e => setSerpDesc(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" rows={3} />
                        <div className="text-xs text-gray-500 mt-1">{serpDesc.length} / 160 chars</div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold dark:text-gray-300">URL</label>
                        <input type="text" value={serpUrl} onChange={e => setSerpUrl(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Google Preview</h3>
                    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500 border">G</div>
                            <div className="text-sm text-[#202124] truncate">
                                <span className="font-medium">example.com</span>
                                <div className="text-xs text-gray-500">{serpUrl}</div>
                            </div>
                        </div>
                        <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate font-medium">{serpTitle || 'Page Title'}</div>
                        <div className="text-sm text-[#4d5156] mt-1 line-clamp-2">{serpDesc || 'Meta description goes here...'}</div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        Title width: ~{serpTitle.length * 9}px (Max 580px)<br/>
                        Desc length: {serpDesc.length} chars (Max ~160)
                    </div>
                </div>
            </div>
        )}

        {/* --- UTM LINK GENERATOR --- */}
        {tool.id === ToolID.UTM_LINK_GENERATOR && (
             <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Website URL *</label><input type="text" value={utmUrl} onChange={e => setUtmUrl(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://example.com" /></div>
                     <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Campaign Source *</label><input type="text" value={utmSource} onChange={e => setUtmSource(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. google, newsletter" /></div>
                     <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Campaign Medium</label><input type="text" value={utmMedium} onChange={e => setUtmMedium(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. cpc, email" /></div>
                     <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Campaign Name</label><input type="text" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. spring_sale" /></div>
                     <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Campaign Term</label><input type="text" value={utmTerm} onChange={e => setUtmTerm(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. running+shoes" /></div>
                     <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Campaign Content</label><input type="text" value={utmContent} onChange={e => setUtmContent(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. logolink, textlink" /></div>
                 </div>
                 <button onClick={generateCode} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md w-full md:w-auto">Generate URL</button>
                 {result && result.code && (
                    <div className="mt-6">
                        <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Generated URL</label>
                        <div className="flex gap-2">
                            <input readOnly value={result.code} className="w-full p-3 border border-gray-300 bg-gray-100 text-gray-900 rounded-lg dark:bg-slate-900 dark:border-slate-600 dark:text-white font-mono text-sm" />
                            <button onClick={() => navigator.clipboard.writeText(result.code)} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700">Copy</button>
                        </div>
                    </div>
                 )}
             </div>
        )}

        {/* --- KEYWORD PERMUTATION --- */}
        {tool.id === ToolID.KEYWORD_PERMUTATION_GENERATOR && (
             <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div>
                         <label className="block text-sm font-semibold mb-2 dark:text-gray-300">List 1</label>
                         <textarea value={permList1} onChange={e => setPermList1(e.target.value)} className="w-full h-40 p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="e.g. buy, get" />
                     </div>
                     <div>
                         <label className="block text-sm font-semibold mb-2 dark:text-gray-300">List 2</label>
                         <textarea value={permList2} onChange={e => setPermList2(e.target.value)} className="w-full h-40 p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="e.g. cheap, best" />
                     </div>
                     <div>
                         <label className="block text-sm font-semibold mb-2 dark:text-gray-300">List 3</label>
                         <textarea value={permList3} onChange={e => setPermList3(e.target.value)} className="w-full h-40 p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="e.g. hosting, vps" />
                     </div>
                 </div>
                 <button onClick={generateCode} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md w-full md:w-auto">Generate Permutations</button>
             </div>
        )}

        {/* --- HTACCESS REDIRECT --- */}
        {tool.id === ToolID.HTACCESS_REDIRECT_GENERATOR && (
             <div className="space-y-6">
                 <div>
                     <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Redirect Type</label>
                     <select value={htaccessType} onChange={e => setHtaccessType(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                         <option value="301">301 Redirect (Permanent)</option>
                         <option value="www">Force www</option>
                         <option value="non-www">Force non-www</option>
                         <option value="https">Force HTTPS</option>
                     </select>
                 </div>
                 {htaccessType === '301' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">Old Relative Path</label><input type="text" value={htaccessOld} onChange={e => setHtaccessOld(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="/old-page.html" /></div>
                         <div><label className="block text-sm font-semibold mb-2 dark:text-gray-300">New Relative Path</label><input type="text" value={htaccessNew} onChange={e => setHtaccessNew(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="/new-page" /></div>
                     </div>
                 )}
                 <button onClick={generateCode} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md w-full md:w-auto">Generate .htaccess Rule</button>
             </div>
        )}

        {/* --- TEXT AREA TOOLS (HTML Ratio, PPC, Bulk URL, Link Extractor) --- */}
        {(tool.id === ToolID.HTML_TEXT_RATIO_CALCULATOR || tool.id === ToolID.PPC_KEYWORD_WRAPPER || tool.id === ToolID.BULK_URL_OPENER || tool.id === ToolID.LINK_EXTRACTOR) && (
             <div className="space-y-6">
                 <div>
                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                         {tool.id === ToolID.BULK_URL_OPENER ? "Enter URLs (one per line)" : 
                          tool.id === ToolID.PPC_KEYWORD_WRAPPER ? "Enter Keywords (one per line)" :
                          "Paste Content / HTML"}
                     </label>
                     <textarea 
                         value={inputText}
                         onChange={(e) => setInputText(e.target.value)}
                         className="w-full h-64 p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                         placeholder="Paste here..."
                     />
                 </div>
                 <button onClick={calculate} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md w-full md:w-auto">
                     {tool.id === ToolID.BULK_URL_OPENER ? "Open URLs" : "Process"}
                 </button>
                 
                 {/* Specific Result Display for Ratio/PPC/Extractor */}
                 {result && (
                     <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 mt-6">
                         {tool.id === ToolID.HTML_TEXT_RATIO_CALCULATOR && (
                             <div className="grid grid-cols-3 gap-4 text-center">
                                 <div><div className="text-xl font-bold dark:text-white">{result.ratio}%</div><div className="text-xs text-gray-500">Text Ratio</div></div>
                                 <div><div className="text-xl font-bold dark:text-white">{result.textSize}</div><div className="text-xs text-gray-500">Text Size (bytes)</div></div>
                                 <div><div className="text-xl font-bold dark:text-white">{result.htmlSize}</div><div className="text-xs text-gray-500">HTML Size (bytes)</div></div>
                             </div>
                         )}
                         
                         {tool.id === ToolID.PPC_KEYWORD_WRAPPER && (
                             <div className="grid grid-cols-3 gap-4">
                                 <div><label className="text-xs font-bold mb-1 block dark:text-gray-300">Broad</label><textarea readOnly value={result.broad} className="w-full h-40 p-2 text-xs border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white" /></div>
                                 <div><label className="text-xs font-bold mb-1 block dark:text-gray-300">"Phrase"</label><textarea readOnly value={result.phrase} className="w-full h-40 p-2 text-xs border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white" /></div>
                                 <div><label className="text-xs font-bold mb-1 block dark:text-gray-300">[Exact]</label><textarea readOnly value={result.exact} className="w-full h-40 p-2 text-xs border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white" /></div>
                             </div>
                         )}

                         {tool.id === ToolID.LINK_EXTRACTOR && (
                             <div className="grid grid-cols-2 gap-6">
                                 <div><label className="text-xs font-bold mb-1 block dark:text-gray-300">Internal Links ({result.internal.length})</label><textarea readOnly value={result.internal.join('\n')} className="w-full h-40 p-2 text-xs border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white" /></div>
                                 <div><label className="text-xs font-bold mb-1 block dark:text-gray-300">External Links ({result.external.length})</label><textarea readOnly value={result.external.join('\n')} className="w-full h-40 p-2 text-xs border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white" /></div>
                             </div>
                         )}
                         
                         {tool.id === ToolID.BULK_URL_OPENER && (
                             <div className="text-center text-green-600 dark:text-green-400 font-bold">
                                 Attempted to open {result.opened} links. (Check popup blocker)
                             </div>
                         )}
                     </div>
                 )}
             </div>
        )}

        {/* --- ANALYSIS TOOLS (Word Count, etc) --- */}
        {(tool.id === ToolID.WORD_COUNTER || tool.id === ToolID.CHARACTER_COUNTER || tool.id === ToolID.READABILITY_SCORE || tool.id === ToolID.KEYWORD_DENSITY_CHECKER || tool.id === ToolID.HEADING_TAG_ANALYZER || tool.id === ToolID.TEXT_STATISTICS) && (
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Paste your text or HTML here</label>
                    <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-64 p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm resize-none"
                        placeholder="Paste content to analyze..."
                    />
                </div>
                <button onClick={calculate} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">Analyze Text</button>
                
                {result && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tool.id === ToolID.TEXT_STATISTICS && (
                            <>
                                <div className="bg-blue-50 dark:bg-slate-900 p-4 rounded-xl text-center border border-blue-100 dark:border-slate-600"><div className="text-3xl font-bold text-blue-600">{result.words}</div><div className="text-xs uppercase font-bold text-gray-500">Words</div></div>
                                <div className="bg-blue-50 dark:bg-slate-900 p-4 rounded-xl text-center border border-blue-100 dark:border-slate-600"><div className="text-3xl font-bold text-blue-600">{result.chars}</div><div className="text-xs uppercase font-bold text-gray-500">Characters</div></div>
                                <div className="bg-blue-50 dark:bg-slate-900 p-4 rounded-xl text-center border border-blue-100 dark:border-slate-600"><div className="text-3xl font-bold text-blue-600">{result.sentences}</div><div className="text-xs uppercase font-bold text-gray-500">Sentences</div></div>
                                <div className="bg-blue-50 dark:bg-slate-900 p-4 rounded-xl text-center border border-blue-100 dark:border-slate-600"><div className="text-3xl font-bold text-blue-600">{result.paragraphs}</div><div className="text-xs uppercase font-bold text-gray-500">Paragraphs</div></div>
                                <div className="bg-green-50 dark:bg-slate-900 p-4 rounded-xl text-center border border-green-100 dark:border-slate-600"><div className="text-xl font-bold text-green-600">~{result.readingTime} min</div><div className="text-xs uppercase font-bold text-gray-500">Reading Time</div></div>
                                <div className="bg-green-50 dark:bg-slate-900 p-4 rounded-xl text-center border border-green-100 dark:border-slate-600"><div className="text-xl font-bold text-green-600">~{result.speakingTime} min</div><div className="text-xs uppercase font-bold text-gray-500">Speaking Time</div></div>
                            </>
                        )}
                        
                        {tool.id === ToolID.CHARACTER_COUNTER && (
                            <>
                                <div className="bg-blue-50 dark:bg-slate-900 p-6 rounded-xl text-center border border-blue-100 dark:border-slate-600">
                                    <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{result.chars}</div>
                                    <div className="text-sm text-gray-500 uppercase font-bold mt-1">Characters</div>
                                </div>
                                <div className="bg-blue-50 dark:bg-slate-900 p-6 rounded-xl text-center border border-blue-100 dark:border-slate-600">
                                    <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{result.words}</div>
                                    <div className="text-sm text-gray-500 uppercase font-bold mt-1">Words</div>
                                </div>
                                <div className="bg-blue-50 dark:bg-slate-900 p-6 rounded-xl text-center border border-blue-100 dark:border-slate-600">
                                    <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{result.lines}</div>
                                    <div className="text-sm text-gray-500 uppercase font-bold mt-1">Lines</div>
                                </div>
                            </>
                        )}
                        {tool.id === ToolID.WORD_COUNTER && (
                            <>
                                <div className="bg-green-50 dark:bg-slate-900 p-6 rounded-xl text-center border border-green-100 dark:border-slate-600">
                                    <div className="text-4xl font-extrabold text-green-600 dark:text-green-400">{result.words}</div>
                                    <div className="text-sm text-gray-500 uppercase font-bold mt-1">Words</div>
                                </div>
                                <div className="bg-green-50 dark:bg-slate-900 p-6 rounded-xl text-center border border-green-100 dark:border-slate-600">
                                    <div className="text-4xl font-extrabold text-green-600 dark:text-green-400">{result.sentences}</div>
                                    <div className="text-sm text-gray-500 uppercase font-bold mt-1">Sentences</div>
                                </div>
                                <div className="bg-green-50 dark:bg-slate-900 p-6 rounded-xl text-center border border-green-100 dark:border-slate-600">
                                    <div className="text-4xl font-extrabold text-green-600 dark:text-green-400">{result.paragraphs}</div>
                                    <div className="text-sm text-gray-500 uppercase font-bold mt-1">Paragraphs</div>
                                </div>
                            </>
                        )}
                        {/* Other result types (Readability, Keyword Density, etc.) would be rendered here similarly */}
                        
                        {tool.id === ToolID.READABILITY_SCORE && (
                            <>
                                <div className="col-span-full bg-blue-50 dark:bg-slate-900 p-6 rounded-xl text-center border border-blue-100 dark:border-slate-600">
                                    <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400">{result.score}</div>
                                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-2">Flesch Reading Ease: {result.grade}</div>
                                </div>
                            </>
                        )}

                        {tool.id === ToolID.KEYWORD_DENSITY_CHECKER && result.keywords && (
                            <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-slate-700">
                                        <tr>
                                            <th className="p-3 font-bold text-gray-700 dark:text-gray-300">Keyword</th>
                                            <th className="p-3 font-bold text-gray-700 dark:text-gray-300">Count</th>
                                            <th className="p-3 font-bold text-gray-700 dark:text-gray-300">Density</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.keywords.map((k: any, i: number) => (
                                            <tr key={i} className="border-b border-gray-100 dark:border-slate-700 last:border-0">
                                                <td className="p-3 text-gray-800 dark:text-gray-300">{k.word}</td>
                                                <td className="p-3 text-gray-800 dark:text-gray-300">{k.count}</td>
                                                <td className="p-3 text-gray-800 dark:text-gray-300">{k.density}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}

        {/* --- GENERATOR TOOLS (Meta, OpenGraph, etc) --- */}
        {(tool.id === ToolID.META_TAG_GENERATOR || tool.id === ToolID.OPEN_GRAPH_GENERATOR || tool.id === ToolID.ROBOTS_TXT_GENERATOR || tool.id === ToolID.SITEMAP_GENERATOR || tool.id === ToolID.SCHEMA_MARKUP_GENERATOR || tool.id === ToolID.CANONICAL_TAG_GENERATOR || tool.id === ToolID.ALT_TEXT_GENERATOR) && (
            <div className="space-y-6">
                {(tool.id === ToolID.META_TAG_GENERATOR || tool.id === ToolID.OPEN_GRAPH_GENERATOR) && (
                    <>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Page Title</label><input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Page Description</label><textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" rows={3} /></div>
                        {tool.id === ToolID.META_TAG_GENERATOR && (
                            <>
                                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Keywords (comma separated)</label><input type="text" value={metaKeywords} onChange={e => setMetaKeywords(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Author</label><input type="text" value={metaAuthor} onChange={e => setMetaAuthor(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                            </>
                        )}
                        {tool.id === ToolID.OPEN_GRAPH_GENERATOR && (
                            <>
                                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Site URL</label><input type="text" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image URL</label><input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Object Type</label>
                                    <select value={ogType} onChange={e => setOgType(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="website">Website</option>
                                        <option value="article">Article</option>
                                        <option value="book">Book</option>
                                        <option value="profile">Profile</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </>
                )}
                {/* Fallback styling for other generators if needed, applying standard style */}
                {tool.id === ToolID.SITEMAP_GENERATOR && (
                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Website URL</label><input type="text" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://example.com" /></div>
                )}
                {tool.id === ToolID.CANONICAL_TAG_GENERATOR && (
                    <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Canonical URL</label><input type="text" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://example.com/page" /></div>
                )}
                {tool.id === ToolID.ROBOTS_TXT_GENERATOR && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Allow Path</label><input type="text" value={allowPath} onChange={e => setAllowPath(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Disallow Path</label><input type="text" value={disallowPath} onChange={e => setDisallowPath(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                        <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sitemap URL</label><input type="text" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    </div>
                )}
                {tool.id === ToolID.ALT_TEXT_GENERATOR && (
                    <>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image URL</label><input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="image.jpg" /></div>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description (Alt Text)</label><input type="text" value={inputText} onChange={e => setInputText(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="A red car..." /></div>
                    </>
                )}
                {tool.id === ToolID.SCHEMA_MARKUP_GENERATOR && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Schema Type</label>
                            <select value={schemaType} onChange={e => setSchemaType(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="Article">Article</option>
                                <option value="Person">Person</option>
                                <option value="Organization">Organization</option>
                                <option value="Product">Product</option>
                            </select>
                        </div>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name / Headline</label><input type="text" value={schemaName} onChange={e => setSchemaName(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Image URL</label><input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                        <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Author Name</label><input type="text" value={schemaAuthor} onChange={e => setSchemaAuthor(e.target.value)} className="w-full p-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    </div>
                )}

                <button onClick={generateCode} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md w-full md:w-auto">Generate Code</button>
                
                {result && result.code && (
                    <div className="mt-6">
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Generated Output</h4>
                        <div className="relative">
                            <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap break-all">{result.code}</pre>
                            <button onClick={() => navigator.clipboard.writeText(result.code)} className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-2 rounded text-xs transition">Copy</button>
                        </div>
                    </div>
                )}
            </div>
        )}

      </div>
      <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">{getSEOContent()}</div>
    </div>
  );
};
