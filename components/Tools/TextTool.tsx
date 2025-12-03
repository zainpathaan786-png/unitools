
import React, { useState, useEffect } from 'react';
import { ToolDefinition, ToolID } from '../../types';

interface Props {
  tool: ToolDefinition;
}

// Compact MD5 Implementation
const md5 = (inputString: string): string => {
    const hc = "0123456789abcdef";
    function rh(n: number) { var j, s = ""; for (j = 0; j <= 3; j++) s += hc.charAt((n >> (j * 8 + 4)) & 0x0F) + hc.charAt((n >> (j * 8)) & 0x0F); return s; }
    function ad(x: number, y: number) { var l = (x & 0xFFFF) + (y & 0xFFFF); var m = (x >> 16) + (y >> 16) + (l >> 16); return (m << 16) | (l & 0xFFFF); }
    function rl(n: number, c: number) { return (n << c) | (n >>> (32 - c)); }
    function cm(q: number, a: number, b: number, x: number, s: number, t: number) { return ad(rl(ad(ad(a, q), ad(x, t)), s), b); }
    function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(b ^ c ^ d, a, b, x, s, t); }
    function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(c ^ (b | (~d)), a, b, x, s, t); }
    function sb(x: string) { var i, n = x.length, a = []; for (i = 0; i < n; i++) a[i >> 2] |= x.charCodeAt(i) << ((i % 4) * 8); return a; }
    function bl(x: number[], len: number) { var i, q = len * 8, n = (q + 64) >>> 9 << 4 | 14, a = x.slice(0); for (i = 0; i < n; i++) a[i] = 0; a[len >> 2] |= 0x80 << ((len % 4) * 8); a[n] = q; return a; }
    
    var x = sb(inputString);
    var a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    x = bl(x, inputString.length);
    for (var i = 0; i < x.length; i += 16) {
        var olda = a, oldb = b, oldc = c, oldd = d;
        a = ff(a, b, c, d, x[i + 0], 7, -680876936); d = ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = ff(c, d, a, b, x[i + 2], 17, 606105819); b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i + 4], 7, -176418897); d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, x[i + 6], 17, -1473231341); b = ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = ff(a, b, c, d, x[i + 8], 7, 1770035416); d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i + 10], 17, -42063); b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, x[i + 12], 7, 1804603682); d = ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = ff(c, d, a, b, x[i + 14], 17, -1502002290); b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = gg(a, b, c, d, x[i + 1], 5, -165796510); d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = gg(c, d, a, b, x[i + 11], 14, 643717713); b = gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = gg(a, b, c, d, x[i + 5], 5, -701558691); d = gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = gg(c, d, a, b, x[i + 15], 14, -1019803690); b = gg(b, c, d, a, x[i + 4], 20, -157050);
        a = hh(a, b, c, d, x[i + 5], 4, -378558); d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i + 11], 16, 1839030562); b = hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = hh(a, b, c, d, x[i + 1], 4, -1530992060); d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = hh(c, d, a, b, x[i + 7], 16, -155497632); b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = hh(a, b, c, d, x[i + 13], 4, 681279174); d = hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = hh(c, d, a, b, x[i + 3], 16, -722521979); b = hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = hh(a, b, c, d, x[i + 9], 4, -640364487); d = hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = hh(c, d, a, b, x[i + 15], 16, 530742520); b = hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = ii(a, b, c, d, x[i + 0], 6, -198630844); d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = ii(c, d, a, b, x[i + 14], 15, -1416354905); b = ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = ii(a, b, c, d, x[i + 12], 6, 1700485571); d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i + 10], 15, -1051523); b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i + 8], 6, 1873313359); d = ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = ii(c, d, a, b, x[i + 6], 15, -1560198380); b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = ii(a, b, c, d, x[i + 4], 6, -145523070); d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = ii(c, d, a, b, x[i + 2], 15, 718787259); b = ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = ad(a, olda); b = ad(b, oldb); c = ad(c, oldc); d = ad(d, oldd);
    }
    return rh(a) + rh(b) + rh(c) + rh(d);
};

// Helper for SHA
async function sha(str: string, algo: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512') {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest(algo, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

// Helper for Smart Title Case
const toSmartTitleCase = (str: string) => {
    const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in']);
    return str.replace(/\w\S*/g, (txt, index) => {
        const lower = txt.toLowerCase();
        if (index !== 0 && minorWords.has(lower)) return lower;
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export const TextTool: React.FC<Props> = ({ tool }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [param, setParam] = useState<string | number>('');
  
  // UUID Extra state
  const [uuidCount, setUuidCount] = useState<number>(1);

  useEffect(() => {
    setInput('');
    setOutput('');
    setParam('');
    setUuidCount(1);
  }, [tool.id]);

  const process = async () => {
    try {
        let res = '';
        if (tool.id === ToolID.HASH_GENERATOR) {
            res = md5(input);
        } else if (tool.id === ToolID.SHA1_GENERATOR) {
            res = await sha(input, 'SHA-1');
        } else if (tool.id === ToolID.SHA256_GENERATOR) {
            res = await sha(input, 'SHA-256');
        } else if (tool.id === ToolID.SHA384_GENERATOR) {
            res = await sha(input, 'SHA-384');
        } else if (tool.id === ToolID.SHA512_GENERATOR) {
            res = await sha(input, 'SHA-512');
        } else if (tool.id === ToolID.BASE64_ENCODER_DECODER) {
            if (param === 'decode') res = atob(input);
            else res = btoa(input);
        } else if (tool.id === ToolID.URL_ENCODER_DECODER) {
            if (param === 'decode') res = decodeURIComponent(input);
            else res = encodeURIComponent(input);
        } else if (tool.id === ToolID.URL_DECODER) {
            res = decodeURIComponent(input);
        } else if (tool.id === ToolID.URL_ENCODER) {
            res = encodeURIComponent(input);
        } else if (tool.id === ToolID.CASE_CONVERTER) {
            if (param === 'upper') res = input.toUpperCase();
            else if (param === 'lower') res = input.toLowerCase();
            else if (param === 'title') res = toSmartTitleCase(input);
            else if (param === 'sentence') res = input.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
            else res = input.toUpperCase();
        } else if (tool.id === ToolID.TEXT_REVERSER) {
            res = input.split('').reverse().join('');
        } else if (tool.id === ToolID.REMOVE_DUPLICATE_LINES) {
            const lines = input.split('\n');
            const unique = Array.from(new Set(lines));
            res = unique.join('\n');
        } else if (tool.id === ToolID.SLUG_GENERATOR) {
            res = input.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        } else if (tool.id === ToolID.UUID_GENERATOR) {
            const count = Math.max(1, Math.min(100, uuidCount));
            const uuids = [];
            for(let i=0; i<count; i++) uuids.push(crypto.randomUUID());
            res = uuids.join('\n');
        } else if (tool.id === ToolID.PASSWORD_GENERATOR) {
            const len = typeof param === 'number' ? param : 12;
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
            let ret = "";
            for (let i = 0, n = charset.length; i < len; ++i) {
                ret += charset.charAt(Math.floor(Math.random() * n));
            }
            res = ret;
        } else if (tool.id === ToolID.JSON_FORMATTER) {
            try {
                const obj = JSON.parse(input);
                if (param === 'minify') {
                    res = JSON.stringify(obj);
                } else {
                    res = JSON.stringify(obj, null, 2);
                }
            } catch(e) {
                res = "Invalid JSON";
            }
        } else if (tool.id === ToolID.LIST_SORTER) {
            const lines = input.split('\n').filter(l => l.trim() !== ''); // Filter empties if needed, or keep? Standard sort usually keeps.
            if (param === 'desc') lines.sort((a, b) => b.localeCompare(a));
            else if (param === 'num') lines.sort((a, b) => parseFloat(a) - parseFloat(b));
            else if (param === 'random') {
                // Fisher-Yates Shuffle
                for (let i = lines.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [lines[i], lines[j]] = [lines[j], lines[i]];
                }
            } else if (param === 'reverse') lines.reverse(); // Just flip current order
            else lines.sort((a, b) => a.localeCompare(b)); // asc
            res = lines.join('\n');
        } else if (tool.id === ToolID.STRIP_HTML) {
            res = input.replace(/<[^>]*>?/gm, '');
        } else if (tool.id === ToolID.ADD_LINE_NUMBERS) {
            res = input.split('\n').map((line, idx) => `${idx + 1}. ${line}`).join('\n');
        } else if (tool.id === ToolID.HTML_ENTITY_ENCODER) {
            if (param === 'decode') {
                const txt = document.createElement("textarea");
                txt.innerHTML = input;
                res = txt.value;
            } else {
                res = input.replace(/[\u00A0-\u9999<>&]/gim, (i) => '&#' + i.charCodeAt(0) + ';');
            }
        } else if (tool.id === ToolID.COLOR_CONVERTER) {
            // Hex to RGB or RGB to Hex detection
            const clean = input.trim();
            if (clean.startsWith('#')) {
                // Hex -> RGB
                const hex = clean.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r + r + g + g + b + b);
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                res = result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : "Invalid Hex";
            } else if (clean.toLowerCase().startsWith('rgb') || clean.includes(',')) {
                // RGB -> Hex
                const parts = clean.match(/\d+/g);
                if (parts && parts.length >= 3) {
                    const r = parseInt(parts[0]);
                    const g = parseInt(parts[1]);
                    const b = parseInt(parts[2]);
                    const toHex = (c: number) => {
                        const hex = Math.max(0, Math.min(255, c)).toString(16);
                        return hex.length === 1 ? "0" + hex : hex;
                    };
                    res = "#" + toHex(r) + toHex(g) + toHex(b);
                    res = res.toUpperCase();
                } else {
                    res = "Invalid RGB";
                }
            } else {
                res = "Enter Hex (#FFF) or RGB (255, 0, 0)";
            }
        } else if (tool.id === ToolID.URL_SANITIZER) {
            const raw = input.trim();
            if (!raw) return;
            const clean = (urlStr: string) => {
                try {
                    const hasProtocol = urlStr.match(/^https?:\/\//);
                    const urlToParse = hasProtocol ? urlStr : `http://${urlStr}`;
                    const url = new URL(urlToParse);
                    const params = url.searchParams;
                    const keysToDelete = [];
                    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'msclkid', 'mc_eid', 'ref', 'source'];
                    for (const key of params.keys()) {
                        if (trackingParams.includes(key) || key.startsWith('utm_')) keysToDelete.push(key);
                    }
                    keysToDelete.forEach(k => params.delete(k));
                    if (!hasProtocol) return url.href.replace(url.protocol + '//', '');
                    return url.href;
                } catch(e) { return urlStr; }
            };
            res = raw.split('\n').map(line => clean(line.trim())).join('\n');
        }
        
        setOutput(res);
    } catch (e) {
        setOutput("Error: " + (e as Error).message);
    }
  };

  const getSEOContent = () => {
    switch(tool.id) {
        case ToolID.SHA1_GENERATOR:
        case ToolID.SHA256_GENERATOR:
        case ToolID.SHA384_GENERATOR:
        case ToolID.SHA512_GENERATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Secure SHA Hash Generator</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Generate secure SHA hashes (SHA-1, SHA-256, SHA-384, SHA-512) for your text online. 
                        SHA (Secure Hash Algorithm) functions are critical for digital signatures, password hashing, and ensuring data integrity. 
                        Unlike MD5, the SHA-2 family (SHA-256, etc.) is considered cryptographically secure and resistant to collision attacks. It functions as a powerful <strong>online sha calculator</strong> for developers.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Our tool runs 100% in your browser using the Web Crypto API, meaning your sensitive data is never sent to a server. 
                        This makes it perfect for generating checksums for files or quickly hashing passwords for testing purposes. Whether you need a <strong>sha hash generator</strong> for verifying downloads or a <strong>secure hashing tool</strong> for development, we have you covered.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Easily <strong>generate sha hash</strong> values instantly. Use the <strong>sha384 generator</strong> or the robust <strong>hash function online</strong> to create unique identifiers. The reliability of our <strong>file checksum</strong> generation ensures your <strong>data integrity</strong> checks are accurate and fast.
                    </p>
                    <KeywordsBox keywords={['sha1 generator', 'sha256 hash', 'sha512 encryption', 'online hash generator', 'secure hash algorithm', 'file checksum', 'data integrity', 'cryptographic hash', 'password hashing', 'hash calculator', 'sha hash generator', 'generate sha hash', 'online sha calculator', 'secure hashing tool', 'sha384 generator', 'hash function online']} />
                </>
            );
        case ToolID.URL_DECODER:
        case ToolID.URL_ENCODER:
        case ToolID.URL_ENCODER_DECODER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Online URL Encoder & Decoder</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        URL encoding (percent-encoding) converts characters into a format that can be transmitted securely over the Internet. 
                        It replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits. This is essential for handling query strings, spaces, and special symbols in web addresses. Use our <strong>url encoding tool</strong> to ensure your links are valid.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Whether you are a developer debugging API requests or a marketer fixing broken tracking links, our tool helps you <strong>encode url</strong> strings or <strong>decode url</strong> parameters instantly. 
                        We handle all standard UTF-8 characters correctly, ensuring your URLs are valid and functional. It acts as a reliable <strong>url decoder online</strong> for quick checks.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        You can <strong>percent encode</strong> special characters with a single click. Our <strong>string encoder</strong> is perfect for preparing data for GET requests. Utilize this <strong>link encoder</strong> to avoid errors in your web applications and ensure seamless data transmission.
                    </p>
                    <KeywordsBox keywords={['url encode online', 'url decode string', 'percent encoding', 'decode uri component', 'html url encoding', 'clean url', 'link encoder', 'query string encoder', 'javascript encodeuri', 'fix broken links', 'encode url', 'decode url', 'url encoding tool', 'url decoder online', 'percent encode', 'string encoder']} />
                </>
            );
        case ToolID.BASE64_ENCODER_DECODER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Base64 Encoder & Decoder</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Base64 encoding is a binary-to-text encoding scheme that converts binary data (such as images or files) into an ASCII string format. 
                        This is commonly used for transmitting data over media that are designed to deal with textual data, such as embedding images directly into HTML/CSS files or sending email attachments. Our <strong>base64 encoder online</strong> simplifies this process.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Use our tool to <strong>encode to base64</strong> raw text or <strong>decode from base64</strong> strings back into readable text. 
                        This utility is essential for developers working with Data URIs, API authentication tokens, or legacy data transfer protocols. It serves as a versatile <strong>base64 decoder online</strong>.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        With our <strong>base64 string converter</strong>, you can handle data securely in your browser. Whether you need to <strong>string to base64</strong> conversion for configuration files or debugging, this tool provides instant and accurate results for all your encoding needs.
                    </p>
                    <KeywordsBox keywords={['base64 encode', 'base64 decode', 'string to base64', 'base64 converter', 'binary to text encoding', 'base64 image decoder', 'decode base64 string', 'encode file base64', 'data uri scheme', 'base64 online tool', 'base64 encoder online', 'base64 decoder online', 'encode to base64', 'decode from base64', 'base64 string converter']} />
                </>
            );
        case ToolID.JSON_FORMATTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">JSON Beautifier & Formatter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        JSON (JavaScript Object Notation) is often minified to save space, making it hard for humans to read. 
                        Use this tool to <strong>pretty print json</strong> data with proper indentation (2 spaces) and line breaks, making it easy to debug and validate structure. It functions as a powerful <strong>json editor online</strong>.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        It also acts as a validator; if you paste invalid JSON, the tool will catch the error. 
                        Essential for web developers working with APIs, configuration files, or data exports. Use our <strong>online json viewer</strong> to inspect complex objects quickly.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Proper indentation helps you <strong>json indent</strong> nested arrays and objects for better readability. Whether you need to <strong>validate json</strong> syntax or simply un-minify a response, this tool is your go-to solution for JSON management.
                    </p>
                    <KeywordsBox keywords={['json prettifier', 'json formatter online', 'minify json', 'json validator', 'beautify json', 'json viewer', 'format json string', 'debug json', 'json lint', 'parse json online', 'json editor online', 'online json viewer', 'pretty print json', 'json indent', 'validate json']} />
                </>
            );
        case ToolID.CASE_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Case Converter Tool</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Easily switch text case between <strong>UPPERCASE</strong>, <strong>lowercase</strong>, <strong>Title Case</strong>, and <strong>Sentence case</strong>. 
                        Perfect for fixing accidental caps lock usage, formatting headlines for blog posts, or standardizing data lists. Our <strong>text case changer</strong> makes it instant.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Simply paste your text and click the desired format. We handle the transformation instantly in your browser, preserving your original text's non-alphabetic characters.
                        Use the <strong>change case online</strong> functionality to quickly adjust email subjects or document titles.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Whether you need a <strong>lower case converter</strong> for coding variables or an <strong>upper case converter</strong> for emphasis, this tool covers all standard transformations. It is an essential <strong>capitalization tool</strong> for writers and developers alike.
                    </p>
                    <KeywordsBox keywords={['text case converter', 'uppercase to lowercase', 'title case generator', 'sentence case online', 'capitalize words', 'caps lock fixer', 'inverse case', 'text transform tool', 'convert string case', 'letter case changer', 'change case online', 'text case changer', 'lower case converter', 'upper case converter', 'capitalization tool']} />
                </>
            );
        case ToolID.REMOVE_DUPLICATE_LINES:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Remove Duplicate Lines</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Clean up your text lists by removing repeated entries instantly. 
                        This tool scans your text and filters out any duplicate lines, leaving you with a unique set of items. Ideal for email lists, database cleaning, and inventory management. Use our <strong>remove duplicates online</strong> feature for quick results.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        It handles large lists efficiently directly in your browser. No data is uploaded, ensuring the privacy of your customer lists or personal data.
                        It acts as a robust <strong>duplicate line remover</strong> for cleaning up logs or data exports.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Need a <strong>unique list generator</strong>? Just paste your messy data here. Our <strong>text deduplicator</strong> ensures every line appears only once. You can also use it to <strong>delete repeated lines</strong> from code or configuration files effortlessly.
                    </p>
                    <KeywordsBox keywords={['remove duplicate lines', 'dedup list', 'unique lines sorter', 'delete duplicates', 'list cleaner', 'remove repeated text', 'clean email list', 'deduplicate text', 'text list organizer', 'finding duplicates', 'remove duplicates online', 'duplicate line remover', 'unique list generator', 'text deduplicator', 'delete repeated lines']} />
                </>
            );
        case ToolID.SLUG_GENERATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">URL Slug Generator</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert post titles or strings into SEO-friendly URL slugs. 
                        This tool removes special characters, converts text to lowercase, and replaces spaces with hyphens, creating clean URLs like <code>my-blog-post-title</code> that search engines love. Use our <strong>slug maker</strong> to optimize your permalinks.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Proper URL slug structure is crucial for SEO and user experience. Use this tool to standardize your permalinks for blogs, e-commerce products, or documentation pages.
                        It is a simple yet powerful <strong>url slug creator</strong> for webmasters.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Stop manually formatting URLs. <strong>Generate url slug</strong> strings instantly from any text input. This <strong>seo url generator</strong> ensures your links are readable and keyword-rich. Convert <strong>title to slug</strong> formats for WordPress, Jekyll, or any other CMS.
                    </p>
                    <KeywordsBox keywords={['url slug generator', 'seo friendly url', 'create slug from title', 'clean url generator', 'hyphenate string', 'website link creator', 'blog url maker', 'permalink generator', 'sanitize title', 'text to slug', 'slug maker', 'url slug creator', 'generate url slug', 'seo url generator', 'title to slug']} />
                </>
            );
        case ToolID.UUID_GENERATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">UUID / GUID Generator</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Generate random Version 4 UUIDs (Universally Unique Identifiers). 
                        UUIDs are 128-bit numbers used to uniquely identify information in computer systems. They are statistically guaranteed to be unique across all devices and time. Our <strong>uuid v4 generator</strong> adheres to RFC 4122 standards.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        This tool uses a cryptographically strong random number generator to ensure the uniqueness of every ID generated. Essential for database keys, session IDs, and software development.
                        It functions as a reliable <strong>online guid generator</strong> for your projects.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Whether you need to <strong>generate uuid</strong> strings for testing or production, our tool delivers. It is a quick <strong>random id generator</strong> that runs locally. Use this <strong>uuid maker</strong> to create unique keys instantly without server requests.
                    </p>
                    <KeywordsBox keywords={['uuid generator', 'guid generator', 'random uuid', 'version 4 uuid', 'unique identifier generator', 'bulk uuid creation', 'rfc 4122', 'generate unique id', 'random key generator', 'developer tools', 'uuid v4 generator', 'online guid generator', 'generate uuid', 'random id generator', 'uuid maker']} />
                </>
            );
        case ToolID.PASSWORD_GENERATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Strong Password Generator</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Create secure, random passwords instantly. Using a mix of uppercase letters, lowercase letters, numbers, and symbols significantly increases the entropy of your password, making it much harder for attackers to guess or crack. Use our <strong>secure password generator</strong> to stay safe online.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Customize the length to meet specific security requirements. Whether you need a 12-character wifi password or a 32-character API key, our tool generates it securely in your browser.
                        It acts as a robust <strong>random password generator</strong> that you can trust.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Don't use "password123". <strong>Create strong password</strong> strings that protect your accounts. Our <strong>password maker</strong> ensures high complexity. Rely on this <strong>safe password generator</strong> for all your credentials.
                    </p>
                    <KeywordsBox keywords={['strong password generator', 'random password creator', 'secure password maker', 'generate password online', 'random string generator', 'password entropy', 'secure login credentials', 'customizable password', 'password security', 'create hard password', 'secure password generator', 'random password generator', 'create strong password', 'password maker', 'safe password generator']} />
                </>
            );
        case ToolID.HASH_GENERATOR:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">MD5 Hash Generator</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Generate an MD5 hash (checksum) from your input string. 
                        While MD5 is no longer considered secure for cryptographic protection (like passwords), it is still widely used for data integrity checks and as a non-cryptographic checksum to verify if two files are identical.
                        Use this tool to <strong>generate md5</strong> hashes instantly.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Our online tool computes the hash locally using JavaScript, providing instant results without sending your data over the network.
                        It functions as a fast <strong>md5 hasher</strong> for text verification.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Whether you need an <strong>online md5</strong> calculator for verifying downloads or legacy systems, this tool helps. You can <strong>create md5 hash</strong> strings from any text input. It is a simple and effective <strong>md5 converter</strong>.
                    </p>
                    <KeywordsBox keywords={['md5 generator', 'md5 hash online', 'md5 encryption', 'md5 checksum', 'string to md5', 'convert text to md5', 'message digest algorithm 5', 'verify file integrity', 'hash calculator', 'one way hash', 'generate md5', 'md5 hasher', 'online md5', 'create md5 hash', 'md5 converter']} />
                </>
            );
        case ToolID.HTML_ENTITY_ENCODER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">HTML Entity Encoder/Decoder</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Convert special characters to their corresponding HTML entities (e.g., <code>&lt;</code> becomes <code>&amp;lt;</code>) to display them safely on a webpage. 
                        This prevents the browser from interpreting them as code, which is crucial for displaying code snippets and preventing XSS attacks. Use our <strong>html encode online</strong> tool for safety.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        You can also decode entities back to their original characters. This is useful for cleaning up scraped content or fixing display issues in CMS platforms.
                        Our <strong>html decode online</strong> functionality reverses the process instantly.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        This <strong>html character encoder</strong> handles all standard entities. Safely <strong>escape html</strong> characters in your strings. Use this <strong>html sanitizer</strong> utility to prepare text for web display without security risks.
                    </p>
                    <KeywordsBox keywords={['html entity encoder', 'html decode', 'escape html characters', 'xml encoder', 'special characters html', 'unescape html', 'convert to html entities', 'web developer tools', 'sanitize html input', 'prevent xss', 'html encode online', 'html decode online', 'html character encoder', 'escape html', 'html sanitizer']} />
                </>
            );
        case ToolID.LIST_SORTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Alphabetical List Sorter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Organize your text lists instantly. Sort lines alphabetically (A-Z or Z-A) or numerically. 
                        Useful for organizing names, inventory items, code variables, or any unstructured list data. Our <strong>alphabetical sorter</strong> makes organization easy.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Just paste your list, select the sort order, and copy the result. A simple tool that saves you time manually reordering items in spreadsheets or documents.
                        It allows you to <strong>sort text lines</strong> efficiently.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Use this <strong>list organizer</strong> for everything from bibliographies to shopping lists. It serves as a comprehensive <strong>a-z sorter</strong>. Try this <strong>online list sorter</strong> to clean up your data in seconds.
                    </p>
                    <KeywordsBox keywords={['alphabetize list', 'sort list online', 'sort text alphabetical', 'numerical sorting', 'reverse list order', 'sort lines a-z', 'organize text list', 'list sorter tool', 'order list items', 'sequence sorter', 'alphabetical sorter', 'sort text lines', 'list organizer', 'a-z sorter', 'online list sorter']} />
                </>
            );
        case ToolID.STRIP_HTML:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Strip HTML Tags</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Remove all HTML tags from a text string, leaving only the plain text content. 
                        This is useful for extracting readable text from web pages, cleaning up copied content from rich text editors, or preprocessing data for analysis. Quickly <strong>remove html tags</strong> with precision.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        The tool preserves the line breaks and structure of the text while efficiently stripping out markup tags like &lt;div&gt;, &lt;span&gt;, and &lt;a&gt;.
                        Use this <strong>html stripper</strong> to get clean content instantly.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Need <strong>clean html text</strong>? Our tool acts as a powerful <strong>text extractor</strong>. Whether you need to <strong>strip tags</strong> from a blog post or clean up code comments, this utility handles it securely in your browser.
                    </p>
                    <KeywordsBox keywords={['strip html tags', 'remove html from text', 'clean html code', 'extract text from html', 'html to text converter', 'delete markup', 'sanitize text', 'clean web content', 'plain text converter', 'remove formatting', 'remove html tags', 'html stripper', 'clean html text', 'text extractor', 'strip tags']} />
                </>
            );
        case ToolID.TEXT_REVERSER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Text Reverser</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Flip your text backwards instantly. "Hello World" becomes "dlroW olleH". 
                        Used for fun, simple obfuscation, or testing palindromes. This <strong>text flipper</strong> reverses characters in seconds.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        This tool reverses the entire string character by character. Useful for social media posts, creating puzzles, or just having fun with text.
                        You can <strong>reverse string online</strong> without any coding.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Create <strong>backwards writing</strong> for creative projects. Use it as a <strong>text mirror</strong> tool. It can also <strong>reverse sentence</strong> structures if you process words individually (coming soon).
                    </p>
                    <KeywordsBox keywords={['reverse text generator', 'backwards text', 'flip text', 'mirror text', 'reverse string', 'palindrome checker', 'reverse words', 'backward writing', 'text inverter', 'fun text tools', 'text flipper', 'reverse string online', 'backwards writing', 'text mirror', 'reverse sentence']} />
                </>
            );
        case ToolID.ADD_LINE_NUMBERS:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Add Line Numbers</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Automatically prepend line numbers to each line of your text. 
                        This is extremely helpful when sharing code snippets, legal documents, or reviewing lists where referencing specific lines is necessary. Use this <strong>line number adder</strong> for clarity.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Simply paste your text, and we'll add sequential numbering to the beginning of every line. You can then copy the numbered list for use in emails, documents, or forums.
                        It allows you to <strong>number lines online</strong> effortlessly.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Need to <strong>add numbers to text</strong>? This tool works as a perfect <strong>list numbering</strong> utility. It functions as a precise <strong>text numerator</strong> for any text block.
                    </p>
                    <KeywordsBox keywords={['add line numbers', 'text line numbering', 'number list online', 'code line numbers', 'list enumerator', 'prefix lines', 'text formatter', 'document numbering', 'count lines', 'organize list', 'line number adder', 'number lines online', 'add numbers to text', 'list numbering', 'text numerator']} />
                </>
            );
        case ToolID.COLOR_CONVERTER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Color Code Converter</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Easily convert color formats between Hex and RGB. Enter a Hex code (like #FFFFFF) to get its RGB equivalent (rgb(255, 255, 255)), or input RGB values (255, 0, 0) to get Hex.
                        Use this to <strong>convert hex to rgb</strong> quickly for your CSS files.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Essential for web designers and developers needing to translate color values for CSS styling or graphic design software.
                        This <strong>rgb converter</strong> simplifies color management.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Also functions as a <strong>hex color converter</strong>. Ensure your <strong>html color converter</strong> needs are met with accuracy. It is a fundamental <strong>css color tool</strong>.
                    </p>
                    <KeywordsBox keywords={['hex to rgb', 'rgb to hex', 'color code converter', 'hex to hsl', 'color picker tool', 'web color converter', 'css color formats', 'html color codes', 'color value translator', 'digital color tool', 'convert hex to rgb', 'rgb converter', 'hex color converter', 'html color converter', 'css color tool']} />
                </>
            );
        case ToolID.URL_SANITIZER:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">URL Cleaner & Sanitizer</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Remove tracking parameters (like <code>utm_source</code>, <code>fbclid</code>, <code>gclid</code>) from URLs to create clean, privacy-friendly links. 
                        Perfect for sharing links on social media or email without the clutter of analytics tags. Use our <strong>clean url online</strong> tool for tidier links.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Clean links look more professional and trustworthy. Our tool strips away known tracking parameters while preserving the essential parts of the URL, ensuring the link still works correctly.
                        It helps you <strong>remove tracking parameters</strong> automatically.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        Perform a full <strong>url detox</strong> on your links. This <strong>link sanitizer</strong> protects user privacy. Create <strong>clean links</strong> for better sharing and aesthetics.
                    </p>
                    <KeywordsBox keywords={['url cleaner', 'remove utm parameters', 'clean tracking links', 'sanitize url', 'remove fbclid', 'link cleaner', 'marketing link cleaner', 'privacy friendly links', 'shorten url params', 'clean query string', 'clean url online', 'remove tracking parameters', 'url detox', 'link sanitizer', 'clean links']} />
                </>
            );
        default:
            return (
                <>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Text Manipulation Tools</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        A versatile collection of utilities for processing, formatting, and encoding text data. 
                        From developers needing to format JSON to writers checking for duplicate lines, these tools run locally in your browser for speed and privacy.
                    </p>
                </>
            );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        {/* Controls specific to tool */}
        {tool.id === ToolID.BASE64_ENCODER_DECODER && (
            <div className="flex gap-4">
                <button onClick={() => {setParam('encode'); process();}} className="bg-blue-600 text-white px-4 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Encode</button>
                <button onClick={() => {setParam('decode'); process();}} className="bg-blue-600 text-white px-4 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Decode</button>
            </div>
        )}
        {tool.id === ToolID.URL_ENCODER_DECODER && (
            <div className="flex gap-4">
                <button onClick={() => {setParam('encode'); process();}} className="bg-blue-600 text-white px-4 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Encode</button>
                <button onClick={() => {setParam('decode'); process();}} className="bg-blue-600 text-white px-4 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Decode</button>
            </div>
        )}
        {tool.id === ToolID.HTML_ENTITY_ENCODER && (
            <div className="flex gap-4">
                <button onClick={() => {setParam('encode'); process();}} className="bg-blue-600 text-white px-4 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Encode</button>
                <button onClick={() => {setParam('decode'); process();}} className="bg-blue-600 text-white px-4 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Decode</button>
            </div>
        )}
        {tool.id === ToolID.CASE_CONVERTER && (
            <div className="flex gap-2 flex-wrap">
                <button onClick={() => {setParam('upper'); process();}} className="bg-blue-600 text-white px-3 py-2 rounded font-medium shadow-sm hover:bg-blue-700">UPPERCASE</button>
                <button onClick={() => {setParam('lower'); process();}} className="bg-blue-600 text-white px-3 py-2 rounded font-medium shadow-sm hover:bg-blue-700">lowercase</button>
                <button onClick={() => {setParam('title'); process();}} className="bg-blue-600 text-white px-3 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Title Case</button>
                <button onClick={() => {setParam('sentence'); process();}} className="bg-blue-600 text-white px-3 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Sentence case</button>
            </div>
        )}
        {tool.id === ToolID.LIST_SORTER && (
            <div className="flex gap-2 flex-wrap">
                <button onClick={() => {setParam('asc'); process();}} className="bg-blue-600 text-white px-3 py-2 rounded font-medium shadow-sm hover:bg-blue-700">A-Z</button>
                <button onClick={() => {setParam('desc'); process();}} className="bg-blue-600 text-white px-3 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Z-A</button>
                <button onClick={() => {setParam('num'); process();}} className="bg-blue-600 text-white px-3 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Numeric</button>
                <button onClick={() => {setParam('random'); process();}} className="bg-blue-600 text-white px-3 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Shuffle</button>
                <button onClick={() => {setParam('reverse'); process();}} className="bg-blue-600 text-white px-3 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Reverse</button>
            </div>
        )}
        {tool.id === ToolID.PASSWORD_GENERATOR && (
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <label className="dark:text-white font-semibold">Length:</label>
                <input type="number" value={param || 12} onChange={(e) => setParam(parseInt(e.target.value))} className="border border-gray-300 dark:border-slate-600 p-2 rounded w-20 bg-gray-50 dark:bg-slate-700 dark:text-white" />
                <button onClick={process} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">Generate</button>
            </div>
        )}
        {tool.id === ToolID.UUID_GENERATOR && (
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <label className="dark:text-white font-semibold">Count:</label>
                <input type="number" min="1" max="100" value={uuidCount} onChange={(e) => setUuidCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} className="border border-gray-300 dark:border-slate-600 p-2 rounded w-20 bg-gray-50 dark:bg-slate-700 dark:text-white" />
                <button onClick={process} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">Generate UUIDs</button>
            </div>
        )}
        {tool.id === ToolID.JSON_FORMATTER && (
            <div className="flex gap-4">
                <button onClick={() => {setParam('pretty'); process();}} className="bg-blue-600 text-white px-4 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Beautify</button>
                <button onClick={() => {setParam('minify'); process();}} className="bg-blue-600 text-white px-4 py-2 rounded font-medium shadow-sm hover:bg-blue-700">Minify</button>
            </div>
        )}
        
        {/* Generic Input/Action/Output */}
        {tool.id !== ToolID.UUID_GENERATOR && tool.id !== ToolID.PASSWORD_GENERATOR && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    <label className="block text-sm font-bold mb-2 dark:text-white">Input</label>
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-64 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder={tool.id === ToolID.URL_SANITIZER ? "Paste URLs here..." : "Enter text..."}
                    />
                </div>
                
                {/* Center Buttons for single-action tools that aren't top-bar configured */}
                {(tool.id !== ToolID.BASE64_ENCODER_DECODER && tool.id !== ToolID.URL_ENCODER_DECODER && tool.id !== ToolID.CASE_CONVERTER && tool.id !== ToolID.HTML_ENTITY_ENCODER && tool.id !== ToolID.LIST_SORTER && tool.id !== ToolID.JSON_FORMATTER) && (
                    <div className="flex flex-col justify-center gap-4 md:hidden">
                        <button onClick={process} className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md w-full">
                            {tool.id === ToolID.URL_DECODER ? 'Decode' : 
                             tool.id === ToolID.URL_ENCODER ? 'Encode' :
                             tool.id === ToolID.URL_SANITIZER ? 'Clean URL' :
                             tool.id === ToolID.COLOR_CONVERTER ? 'Convert Color' :
                             tool.id.includes('generator') ? 'Generate Hash' : 'Process'}
                        </button>
                    </div>
                )}
                {/* Desktop Center Button for single-action tools */}
                {(tool.id !== ToolID.BASE64_ENCODER_DECODER && tool.id !== ToolID.URL_ENCODER_DECODER && tool.id !== ToolID.CASE_CONVERTER && tool.id !== ToolID.HTML_ENTITY_ENCODER && tool.id !== ToolID.LIST_SORTER && tool.id !== ToolID.JSON_FORMATTER) && (
                     <div className="hidden md:flex flex-col justify-center">
                        <button onClick={process} className="bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition shadow-md whitespace-nowrap">
                            {tool.id === ToolID.URL_DECODER ? 'Decode \u2192' : 
                             tool.id === ToolID.URL_ENCODER ? 'Encode \u2192' :
                             tool.id === ToolID.URL_SANITIZER ? 'Clean URL \u2192' :
                             tool.id === ToolID.COLOR_CONVERTER ? 'Convert \u2192' :
                             tool.id.includes('generator') ? 'Generate \u2192' : 'Process \u2192'}
                        </button>
                     </div>
                )}

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    <label className="block text-sm font-bold mb-2 dark:text-white">Output</label>
                    <textarea 
                        readOnly
                        value={output}
                        className="w-full h-64 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-0 outline-none"
                        placeholder="Result will appear here..."
                    />
                </div>
            </div>
        )}
        
        {(tool.id === ToolID.UUID_GENERATOR || tool.id === ToolID.PASSWORD_GENERATOR) && (
             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 text-center shadow-sm">
                 <h3 className="text-xl font-bold mb-4 dark:text-white">Result</h3>
                 <textarea 
                    readOnly 
                    value={output} 
                    className="w-full h-64 p-4 text-lg font-mono bg-gray-100 dark:bg-slate-900 border-none rounded resize-none focus:ring-0 text-gray-800 dark:text-white"
                    placeholder="Click Generate to see results"
                 />
             </div>
        )}

        {/* SEO CONTENT SECTION */}
        <div className="mt-16 prose dark:prose-invert max-w-none bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            {getSEOContent()}
        </div>
    </div>
  );
};
