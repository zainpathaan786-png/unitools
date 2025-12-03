
import React, { useMemo } from 'react';
import { ToolCategory, PageType } from '../../types';
import { TOOLS } from '../../constants';

interface SidebarProps {
  activeCategory: ToolCategory;
  onCategorySelect: (category: ToolCategory) => void;
  onNavigate: (page: PageType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onCategorySelect, onNavigate, isOpen, onClose }) => {
  // Calculate the number of tools in each category
  const counts = useMemo(() => {
    const c: Record<string, number> = {
      [ToolCategory.ALL]: TOOLS.length
    };
    
    // Initialize specific categories to 0
    Object.values(ToolCategory).forEach(cat => {
      if (cat !== ToolCategory.ALL) {
        c[cat] = 0;
      }
    });

    // Count tools per category
    TOOLS.forEach(tool => {
      if (c[tool.category] !== undefined) {
        c[tool.category]++;
      }
    });

    return c;
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 z-50 transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white cursor-pointer" onClick={() => { onCategorySelect(ToolCategory.ALL); onClose(); }}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                </svg>
            </div>
            <span>Uni<span className="text-blue-600">Tools</span></span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)] scrollbar-thin">
          <div className="pb-4 mb-4 border-b border-gray-100 dark:border-slate-800">
              <button
                onClick={() => { onCategorySelect(ToolCategory.ALL); onClose(); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Home
              </button>
              <button
                onClick={() => { onNavigate('about'); onClose(); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                About Us
              </button>
              <button
                onClick={() => { onNavigate('blog'); onClose(); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                Blog
              </button>
              <button
                onClick={() => { onNavigate('contact'); onClose(); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Contact
              </button>
          </div>

          <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</div>
          
          {Object.values(ToolCategory).map((category) => (
            <button
              key={category}
              onClick={() => {
                onCategorySelect(category);
                onClose();
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group ${
                activeCategory === category
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{category}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                 activeCategory === category 
                   ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                   : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-slate-700'
              }`}>
                {counts[category] || 0}
              </span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};
