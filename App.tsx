import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TOOLS } from './constants';
import { ToolCategory, ToolDefinition, ToolID, PageType } from './types';
import { Sidebar } from './components/Layout/Sidebar';
import { TopHeader } from './components/Layout/TopHeader';
import { Footer } from './components/Layout/Footer';
import { ToolCard } from './components/Layout/ToolCard';
import { CategoryGrid } from './components/Layout/CategoryGrid';
import { SEO } from './components/SEO';

// Pages
import { AboutUs } from './components/Pages/AboutUs';
import { ContactUs } from './components/Pages/ContactUs';
import { PrivacyPolicy } from './components/Pages/PrivacyPolicy';
import { TermsOfService } from './components/Pages/TermsOfService';
import { CookiePolicy } from './components/Pages/CookiePolicy';
import { Blog } from './components/Pages/Blog';

// Tools
import { PdfTool } from './components/Tools/PdfTool';
import { ImageEditorTool } from './components/Tools/ImageEditorTool';
import { ImageConverterTool } from './components/Tools/ImageConverterTool';
import { DataConverterTool } from './components/Tools/DataConverterTool';
import { UnitConverterTool } from './components/Tools/UnitConverterTool';
import { MathScienceCalculatorTool } from './components/Tools/MathScienceCalculatorTool';
import { FinancialCalculatorTool } from './components/Tools/FinancialCalculatorTool';
import { FitnessCalculatorTool } from './components/Tools/FitnessCalculatorTool';
import { DateTimeTool } from './components/Tools/DateTimeTool';
import { SeoTool } from './components/Tools/SeoTool';
import { LoremIpsumGeneratorTool } from './components/Tools/LoremIpsumGeneratorTool';
import { RandomNumberGeneratorTool } from './components/Tools/RandomNumberGeneratorTool';
import { YesNoGeneratorTool } from './components/Tools/YesNoGeneratorTool';
import { CoinFlipTool } from './components/Tools/CoinFlipTool';
import { DiceRollerTool } from './components/Tools/DiceRollerTool';
import { BinaryTool } from './components/Tools/BinaryTool';
import { MiscConverterTool } from './components/Tools/MiscConverterTool';
import { ZodiacTool } from './components/Tools/ZodiacTool';
import { MorseConverterTool } from './components/Tools/MorseConverterTool';
import { CreateZipTool } from './components/Tools/CreateZipTool';
import { EpochConverterTool } from './components/Tools/EpochConverterTool';
import { PDFEditorTool } from './components/Tools/PDFEditorTool';
import { LeetSpeakTool } from './components/Tools/LeetSpeakTool';
import { TextTool } from './components/Tools/TextTool';
import { TextDiffTool } from './components/Tools/TextDiffTool';
import { Base64ImageTool } from './components/Tools/Base64ImageTool';

const App: React.FC = () => {
  // State
  const [activeCategory, setActiveCategory] = useState<ToolCategory>(ToolCategory.ALL);
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [activePage, setActivePage] = useState<PageType>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);
  
  const sliderRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers
  const handleCategorySelect = (category: ToolCategory) => {
    setActiveCategory(category);
    setActiveTool(null);
    setActivePage(null);
    setSearchQuery('');
    setShowAllTools(false);
    window.scrollTo(0, 0);
  };

  const handleToolSelect = (tool: ToolDefinition) => {
    setActiveTool(tool);
    setActivePage(null);
    window.scrollTo(0, 0);
  };

  const handleNavigate = (page: PageType) => {
    setActivePage(page);
    setActiveTool(null);
    window.scrollTo(0, 0);
  };

  const scrollSlider = (direction: 'left' | 'right') => {
      if (sliderRef.current) {
          const scrollAmount = 360;
          sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      }
  };

  const renderTool = () => {
    if (!activeTool) return null;
    
    // Explicit ID checks first - remove onBack to hide internal exit button
    if (activeTool.id === ToolID.PDF_EDITOR) return <PDFEditorTool tool={activeTool} />;
    if (activeTool.id === ToolID.ESIGN_PDF) return <PDFEditorTool tool={activeTool} />; 
    
    // Category based routing
    switch (activeTool.category) {
        case ToolCategory.PDF:
            return <PdfTool tool={activeTool} />;
        case ToolCategory.IMAGE:
            if (activeTool.id === ToolID.IMAGE_TO_BASE64 || activeTool.id === ToolID.BASE64_TO_IMAGE) return <Base64ImageTool tool={activeTool} />;
            // Exclude editor tools (like grayscale/sketch) from converter tool, even if they have "to" in name
            if (activeTool.id === ToolID.TO_GRAYSCALE || activeTool.id === ToolID.IMAGE_TO_SKETCH) return <ImageEditorTool tool={activeTool} />;
            
            if (activeTool.id.includes('to-') || activeTool.id.includes('gif-to-mp4')) return <ImageConverterTool tool={activeTool} />;
            return <ImageEditorTool tool={activeTool} />;
        case ToolCategory.SEO:
            return <SeoTool tool={activeTool} />;
        case ToolCategory.TEXT:
            if ([ToolID.WORD_COUNTER, ToolID.CHARACTER_COUNTER, ToolID.READABILITY_SCORE, ToolID.TEXT_STATISTICS].includes(activeTool.id)) {
                return <SeoTool tool={activeTool} />;
            }
            if (activeTool.id === ToolID.LEET_SPEAK_TRANSLATOR) return <LeetSpeakTool tool={activeTool} />;
            if (activeTool.id === ToolID.LOREM_IPSUM_GENERATOR) return <LoremIpsumGeneratorTool tool={activeTool} />;
            if (activeTool.id.includes('binary')) return <BinaryTool tool={activeTool} />;
            if (activeTool.id.includes('morse')) return <MorseConverterTool tool={activeTool} />;
            if (activeTool.id === ToolID.TEXT_DIFF_CHECKER) return <TextDiffTool tool={activeTool} />;
            return <TextTool tool={activeTool} />;
        case ToolCategory.FINANCIAL:
            return <FinancialCalculatorTool tool={activeTool} />;
        case ToolCategory.DATE_TIME:
            return <DateTimeTool tool={activeTool} />;
        case ToolCategory.FITNESS:
            return <FitnessCalculatorTool tool={activeTool} />;
        case ToolCategory.MATH_SCIENCE:
            return <MathScienceCalculatorTool tool={activeTool} />;
        case ToolCategory.UNIT_CONVERTER:
             if (['csv','xml','json','excel'].some(k => activeTool.id.includes(k))) return <DataConverterTool tool={activeTool} />;
             return <UnitConverterTool tool={activeTool} />;
    }
    
    // ID Based fallbacks for OTHER or miscategorized items
    if (activeTool.id === ToolID.LOREM_IPSUM_GENERATOR) return <LoremIpsumGeneratorTool tool={activeTool} />;
    if (activeTool.id === ToolID.RANDOM_NUMBER_GENERATOR) return <RandomNumberGeneratorTool tool={activeTool} />;
    if (activeTool.id === ToolID.YES_NO_GENERATOR) return <YesNoGeneratorTool tool={activeTool} />;
    if (activeTool.id === ToolID.COIN_FLIP) return <CoinFlipTool tool={activeTool} />;
    if (activeTool.id === ToolID.DICE_ROLLER) return <DiceRollerTool tool={activeTool} />;
    if (activeTool.id.includes('binary')) return <BinaryTool tool={activeTool} />;
    if (activeTool.id === ToolID.ROMAN_NUMERAL_CONVERTER || activeTool.id === ToolID.SHOES_SIZE_CONVERTER) return <MiscConverterTool tool={activeTool} />;
    if (activeTool.id === ToolID.CHINESE_ZODIAC_CALCULATOR) return <ZodiacTool tool={activeTool} />;
    if (activeTool.id.includes('morse')) return <MorseConverterTool tool={activeTool} />;
    if (activeTool.id === ToolID.CREATE_ZIP) return <CreateZipTool tool={activeTool} />;
    if (activeTool.id === ToolID.EPOCH_CONVERTER) return <EpochConverterTool tool={activeTool} />;
    if (activeTool.id === ToolID.LEET_SPEAK_TRANSLATOR) return <LeetSpeakTool tool={activeTool} />;
    
    // Fix: Route missing 'Other' category tools to their respective calculator components
    if ([ToolID.PRIME_NUMBER_GENERATOR, ToolID.LCM_GCD_CALCULATOR, ToolID.PERCENTAGE_TO_CGPA].includes(activeTool.id)) {
        return <MathScienceCalculatorTool tool={activeTool} />;
    }
    if ([ToolID.GDP_CALCULATOR, ToolID.TIP_CALCULATOR, ToolID.BILL_SPLITTER, ToolID.VAT_CALCULATOR].includes(activeTool.id)) {
        return <FinancialCalculatorTool tool={activeTool} />;
    }
    if (activeTool.id === ToolID.STEP_COUNTER_TO_DISTANCE) {
        return <FitnessCalculatorTool tool={activeTool} />;
    }

    // Catch-all for Data Converters if they fell through
    if (['csv','xml','json','excel'].some(k => activeTool.id.includes(k))) return <DataConverterTool tool={activeTool} />;

    return <div className="p-8 text-center text-gray-500">Tool implementation not found.</div>;
  };

  // Filtered Tools
  const filteredTools = useMemo(() => {
      let tools = TOOLS;
      if (activeCategory !== ToolCategory.ALL) {
          tools = tools.filter(t => t.category === activeCategory);
      }
      if (searchQuery) {
          const q = searchQuery.toLowerCase();
          tools = tools.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
      }
      return tools;
  }, [activeCategory, searchQuery]);

  // Display Logic
  const displayedTools = useMemo(() => {
      if (searchQuery) return filteredTools;
      
      if (activeCategory !== ToolCategory.ALL) {
          return filteredTools;
      }

      if (showAllTools) return filteredTools;
      
      return filteredTools.filter(t => t.isPopular).slice(0, 8);
  }, [activeCategory, filteredTools, searchQuery, showAllTools]);

  // Featured Tools Config
  const featuredToolIds = [
      ToolID.PDF_EDITOR,
      ToolID.ESIGN_PDF,
      ToolID.COMPRESS_IMAGE,
      ToolID.PDF_TO_WORD,
      ToolID.PDF_MERGE,
      ToolID.WORD_TO_PDF
  ];
  
  const getFeaturedConfig = (id: string) => {
      switch(id) {
          case ToolID.PDF_EDITOR: return { bg: 'bg-blue-50', accent: 'text-blue-600', blob: 'bg-blue-300/30', border: 'border-blue-100', bar: 'bg-blue-600' };
          case ToolID.ESIGN_PDF: return { bg: 'bg-purple-50', accent: 'text-purple-600', blob: 'bg-purple-300/30', border: 'border-purple-100', bar: 'bg-purple-600' };
          case ToolID.COMPRESS_IMAGE: return { bg: 'bg-emerald-50', accent: 'text-emerald-600', blob: 'bg-emerald-300/30', border: 'border-emerald-100', bar: 'bg-emerald-600' };
          case ToolID.PDF_TO_WORD: return { bg: 'bg-orange-50', accent: 'text-orange-600', blob: 'bg-orange-300/30', border: 'border-orange-100', bar: 'bg-orange-600' };
          case ToolID.PDF_MERGE: return { bg: 'bg-rose-50', accent: 'text-rose-600', blob: 'bg-rose-300/30', border: 'border-rose-100', bar: 'bg-rose-600' };
          case ToolID.WORD_TO_PDF: return { bg: 'bg-cyan-50', accent: 'text-cyan-600', blob: 'bg-cyan-300/30', border: 'border-cyan-100', bar: 'bg-cyan-600' };
          default: return { bg: 'bg-slate-50', accent: 'text-slate-600', blob: 'bg-slate-300/30', border: 'border-slate-100', bar: 'bg-slate-600' };
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 flex flex-col font-sans">
      <SEO 
        title="UniTools - All-in-One Utility Suite" 
        description="Free online PDF tools, Image editors, and Converters. Merge PDF, Compress Image, Calculate Loans and more." 
      />
      
      <TopHeader 
        onCategorySelect={handleCategorySelect} 
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <Sidebar 
        activeCategory={activeCategory} 
        onCategorySelect={handleCategorySelect}
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-grow w-full">
        {activeTool ? (
          <div className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 relative min-h-[calc(100vh-100px)]">
            
            {/* Absolute Top-Left Back Button */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
                <button 
                  onClick={() => setActiveTool(null)}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                  Back to Tools
                </button>
            </div>
            
            {/* Spacer for Content */}
            <div className="pt-12">
                {activeTool.id !== ToolID.PDF_EDITOR && activeTool.id !== ToolID.ESIGN_PDF && (
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-slate-800 rounded-2xl mb-4 shadow-sm text-blue-600 dark:text-blue-400">
                            <div className="w-8 h-8">
                                {activeTool.icon}
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
                            {activeTool.title}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            {activeTool.description}
                        </p>
                    </div>
                )}

                {renderTool()}
            </div>
          </div>
        ) : activePage ? (
          <div className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
             {activePage === 'about' && <AboutUs />}
             {activePage === 'contact' && <ContactUs />}
             {activePage === 'privacy' && <PrivacyPolicy />}
             {activePage === 'terms' && <TermsOfService />}
             {activePage === 'cookies' && <CookiePolicy />}
             {activePage === 'blog' && <Blog />}
          </div>
        ) : (
          <div className="animate-fadeIn">
            {/* ... Home Content (Hero, Stats, etc.) ... */}
            {activeCategory === ToolCategory.ALL ? (
                /* MAIN HOME HERO */
                <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-slate-50 dark:bg-[#0B1120] transition-colors duration-200">
                    <div className="absolute top-0 left-0 w-full z-20 flex justify-start px-4 sm:px-8 pt-6 pointer-events-none">
                        <div className="flex flex-wrap items-center gap-2.5 pointer-events-auto">
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1 hidden sm:inline-block">Popular:</span>
                            {[
                                { label: 'PDF to Word', id: ToolID.PDF_TO_WORD, style: 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' },
                                { label: 'Compress Image', id: ToolID.COMPRESS_IMAGE, style: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800' },
                                { label: 'Loan Calculator', id: ToolID.LOAN_CALCULATOR, style: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800' },
                                { label: 'BMI', id: ToolID.BMI_CALCULATOR, style: 'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800' }
                            ].map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => {
                                        const tool = TOOLS.find(t => t.id === item.id);
                                        if(tool) handleToolSelect(tool);
                                    }}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all duration-200 ${item.style} shadow-sm hover:shadow-md hover:-translate-y-0.5`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                    
                    <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
                            Every tool you need,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                right in your browser.
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                            UniTools is your all-in-one utility suite. Edit PDFs, convert images, calculate finances, and more.
                        </p>

                        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-10 animate-fadeIn">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-green-200 dark:border-green-900/30 shadow-sm">
                                <div className="bg-green-100 dark:bg-green-900/50 rounded-full p-1">
                                    <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">100% Free</span>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-blue-200 dark:border-blue-900/30 shadow-sm">
                                <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-1">
                                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Secure</span>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-purple-200 dark:border-purple-900/30 shadow-sm">
                                <div className="bg-purple-100 dark:bg-purple-900/50 rounded-full p-1">
                                    <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">No Sign-up required</span>
                            </div>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto group mb-8">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-200"></div>
                            <div className="relative flex items-center">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <svg className="h-6 w-6 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-16 pr-32 py-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all shadow-xl text-lg font-medium"
                                    placeholder="Search for tools (e.g. 'pdf to word')"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute right-2.5 top-2.5 bottom-2.5">
                                    <button 
                                        className="h-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-8 transition-colors duration-200 shadow-md flex items-center"
                                        onClick={() => {}} 
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* CATEGORY SPECIFIC HERO */
                <div className="relative bg-slate-50 dark:bg-[#0B1120] pt-16 pb-12 mb-6 border-b border-gray-100 dark:border-slate-800">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    
                    {/* Absolute Back Button */}
                    <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
                        <button 
                            onClick={() => handleCategorySelect(ToolCategory.ALL)}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Categories
                        </button>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                            {activeCategory}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10">
                            Free Online {activeCategory}
                        </p>
                        
                        <div className="relative max-w-xl mx-auto group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-14 pr-32 py-4 rounded-full bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all shadow-lg text-lg"
                                placeholder={`Search ${activeCategory.toLowerCase()}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button 
                                className="absolute right-2 top-2 bottom-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full px-8 transition-colors duration-200"
                                onClick={() => {}} 
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Logic / Grid / Etc from original App.tsx */}
                {searchQuery ? (
                    <div className="mb-16">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Search Results</h2>
                        {filteredTools.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTools.map(tool => (
                                    <ToolCard key={tool.id} tool={tool} onClick={handleToolSelect} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                                <p className="text-gray-500 dark:text-gray-400">No tools found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {activeCategory === ToolCategory.ALL && (
                            <div className="mb-16">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Explore by Category</h2>
                                <CategoryGrid onCategorySelect={handleCategorySelect} />
                            </div>
                        )}

                        <div id="tools-grid" className="scroll-mt-24 mb-16">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {activeCategory === ToolCategory.ALL ? 'All Tools' : 'Available Tools'}
                                </h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    {filteredTools.length} tools
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {displayedTools.map(tool => (
                                    <ToolCard key={tool.id} tool={tool} onClick={handleToolSelect} />
                                ))}
                            </div>

                            {!showAllTools && activeCategory === ToolCategory.ALL && filteredTools.length > 8 && (
                                <div className="mt-12 text-center">
                                    <button 
                                        onClick={() => setShowAllTools(true)}
                                        className="px-8 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm hover:shadow-md"
                                    >
                                        View All {filteredTools.length} Tools
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Featured, Stats, FAQ (Only on Home) */}
                        {activeCategory === ToolCategory.ALL && (
                            <>
                                <div className="mb-16 relative group">
                                    <div className="flex justify-between items-end mb-6 px-1">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Free Tools You'd Usually Pay For</h2>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Tools used by thousands daily</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => scrollSlider('left')} className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 shadow-sm transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                            </button>
                                            <button onClick={() => scrollSlider('right')} className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 shadow-sm transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        ref={sliderRef}
                                        className="flex gap-5 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
                                        style={{ scrollBehavior: 'smooth' }}
                                    >
                                        {featuredToolIds.map(id => {
                                            const tool = TOOLS.find(t => t.id === id);
                                            if (!tool) return null;
                                            const config = getFeaturedConfig(id);
                                            return (
                                                <div 
                                                    key={id}
                                                    onClick={() => handleToolSelect(tool)}
                                                    className={`
                                                        flex-none w-[280px] sm:w-[320px] snap-center cursor-pointer
                                                        bg-white dark:bg-slate-800 rounded-2xl p-6 
                                                        border border-gray-100 dark:border-slate-700
                                                        shadow-lg shadow-gray-100/50 dark:shadow-none
                                                        hover:-translate-y-1 hover:shadow-xl transition-all duration-300
                                                        relative overflow-hidden group/card
                                                    `}
                                                >
                                                    <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full ${config.blob} blur-2xl group-hover/card:scale-150 transition-transform duration-500`}></div>
                                                    <div className="relative z-10">
                                                        <div className={`w-12 h-12 ${config.bg} ${config.accent} rounded-xl flex items-center justify-center mb-4`}>
                                                            {tool.icon}
                                                        </div>
                                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{tool.title}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">{tool.description}</p>
                                                        <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white group-hover/card:translate-x-1 transition-transform">
                                                            Try now 
                                                            <svg className={`ml-2 w-4 h-4 ${config.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                        </div>
                                                    </div>
                                                    <div className={`absolute bottom-0 left-0 w-full h-1 ${config.bar} transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-300 origin-left`}></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="animate-fadeIn">
                                    <div className="max-w-4xl mx-auto text-center px-4 mb-12">
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                                            The software trusted by millions of users
                                        </h2>
                                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                                            UniTools is your number one web app for editing PDF and files with ease. Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
                                        </p>
                                    </div>

                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-center hover:shadow-md transition-shadow">
                                                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">1.23M+</div>
                                                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Files Processed</div>
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-center hover:shadow-md transition-shadow">
                                                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">274+</div>
                                                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tools for You</div>
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-center hover:shadow-md transition-shadow">
                                                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">100%</div>
                                                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Free Forever</div>
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm text-center hover:shadow-md transition-shadow">
                                                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">4.8/5</div>
                                                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Rating</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                                        <div className="border-t border-gray-200 dark:border-slate-800 pt-10">
                                            <p className="text-center text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">
                                                Trusted by innovative teams
                                            </p>
                                            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                                <div className="flex items-center gap-2 text-xl font-bold text-gray-600 dark:text-gray-400">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                                                    <span>Acme Inc.</span>
                                                </div>
                                                <div className="text-2xl font-black italic text-gray-600 dark:text-gray-400 tracking-tighter">
                                                    VERTEX
                                                </div>
                                                <div className="flex items-center gap-1 text-xl font-semibold text-gray-600 dark:text-gray-400">
                                                    <div className="w-4 h-4 rounded-full bg-current"></div>
                                                    <span>Global</span>
                                                </div>
                                                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 tracking-tight">
                                                    stripe
                                                </div>
                                                <div className="flex items-center gap-2 text-xl font-medium text-gray-600 dark:text-gray-400 uppercase">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                    NextGen
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={handleNavigate} onCategorySelect={handleCategorySelect} />
    </div>
  );
};

export default App;