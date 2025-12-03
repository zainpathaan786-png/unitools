
import React, { useMemo } from 'react';
import { ToolCategory } from '../../types';
import { TOOLS } from '../../constants';

interface CategoryGridProps {
  onCategorySelect: (category: ToolCategory) => void;
}

// Map each category to specific color styles for the ICON only
const CATEGORY_THEMES: Record<string, { color: string, bg: string, border: string, blob: string }> = {
  [ToolCategory.PDF]: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', blob: 'bg-red-200' },
  [ToolCategory.IMAGE]: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', blob: 'bg-purple-200' },
  [ToolCategory.FINANCIAL]: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', blob: 'bg-emerald-200' },
  [ToolCategory.FITNESS]: { color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', blob: 'bg-sky-200' },
  [ToolCategory.MATH_SCIENCE]: { color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', blob: 'bg-cyan-200' },
  [ToolCategory.SEO]: { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', blob: 'bg-indigo-200' },
  [ToolCategory.TEXT]: { color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', blob: 'bg-teal-200' },
  [ToolCategory.UNIT_CONVERTER]: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', blob: 'bg-amber-200' },
  [ToolCategory.DATE_TIME]: { color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200', blob: 'bg-pink-200' },
  [ToolCategory.OTHER]: { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', blob: 'bg-slate-200' },
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  [ToolCategory.PDF]: "Edit, Merge & Convert PDFs",
  [ToolCategory.IMAGE]: "Compress, Resize & Edit Photos",
  [ToolCategory.FINANCIAL]: "Loans, Tax & Investment Calcs",
  [ToolCategory.FITNESS]: "BMI, Body Fat & Health Tools",
  [ToolCategory.MATH_SCIENCE]: "Geometry, Algebra & Physics",
  [ToolCategory.SEO]: "Meta Tags & Webmaster Tools",
  [ToolCategory.TEXT]: "Encoders, Decoders & Generators",
  [ToolCategory.UNIT_CONVERTER]: "Length, Weight & More",
  [ToolCategory.DATE_TIME]: "Age, Time Zone & Date Calc",
  [ToolCategory.OTHER]: "Random Gens & Misc Tools",
};

// Icons
const CategoryIcons: Record<string, React.ReactNode> = {
  [ToolCategory.PDF]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  [ToolCategory.IMAGE]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  [ToolCategory.FINANCIAL]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  [ToolCategory.FITNESS]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  [ToolCategory.MATH_SCIENCE]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  [ToolCategory.SEO]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  [ToolCategory.TEXT]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
  [ToolCategory.UNIT_CONVERTER]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  [ToolCategory.DATE_TIME]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  [ToolCategory.OTHER]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  ),
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    Object.values(ToolCategory).forEach(cat => {
      if (cat !== ToolCategory.ALL) {
        c[cat] = TOOLS.filter(t => t.category === cat).length;
      }
    });
    return c;
  }, []);

  const categories = Object.values(ToolCategory).filter(c => c !== ToolCategory.ALL);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {categories.map((category) => {
        const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES[ToolCategory.OTHER];
        const description = CATEGORY_DESCRIPTIONS[category] || "Useful online tools";
        const count = counts[category] || 0;

        return (
          <button 
            key={category}
            onClick={() => onCategorySelect(category)}
            className="flex flex-col items-center text-center p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden h-full min-h-[200px]"
          >
             {/* Decorative background circle - now more colorful/opaque */}
             <div className={`absolute top-0 right-0 w-24 h-24 ${theme.blob} rounded-bl-full opacity-40 dark:opacity-20 transition-transform duration-500 group-hover:scale-125`} />

            <div className={`w-10 h-10 rounded-lg ${theme.bg} ${theme.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300 z-10`}>
              <div className="w-5 h-5">
                {CategoryIcons[category]}
              </div>
            </div>
            
            <div className="z-10 w-full flex-1 flex flex-col items-center">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex-1 flex items-center justify-center min-h-[28px] px-2 leading-relaxed">
                {description}
              </p>
              
              <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-gray-50 dark:bg-slate-700 text-[10px] font-bold text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 dark:group-hover:bg-slate-600 dark:group-hover:text-blue-300 transition-colors">
                {count} TOOLS
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
