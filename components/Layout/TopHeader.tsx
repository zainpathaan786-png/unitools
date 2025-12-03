
import React from 'react';
import { ToolCategory, PageType } from '../../types';

interface TopHeaderProps {
  onCategorySelect: (category: ToolCategory) => void;
  onNavigate: (page: PageType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onMenuClick: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ 
  onCategorySelect, 
  onNavigate,
  isDarkMode,
  toggleDarkMode,
  onMenuClick
}) => {
  
  const handleLogoClick = () => {
    onCategorySelect(ToolCategory.ALL);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo Section */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                 </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Uni<span className="text-blue-600">Tools</span>
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
                <button 
                    onClick={() => onCategorySelect(ToolCategory.ALL)}
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                >
                    HOME
                </button>
                <button 
                    onClick={() => onNavigate('about')}
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                >
                    ABOUT US
                </button>
            </nav>

            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 hidden md:block"></div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-700"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
