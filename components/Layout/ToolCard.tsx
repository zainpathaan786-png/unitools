
import React from 'react';
import { ToolDefinition } from '../../types';

interface ToolCardProps {
  tool: ToolDefinition;
  onClick: (tool: ToolDefinition) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <div 
      onClick={() => onClick(tool)}
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-5">
          <div className="p-3.5 bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
            <div className="w-6 h-6 flex items-center justify-center">
                {tool.icon}
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {tool.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>
    </div>
  );
};
