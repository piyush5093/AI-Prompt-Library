import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0f0f0f] py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          AI Prompt Library
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 transition-colors"
        >
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        <button className="bg-slate-700 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors">
          New Prompt
        </button>
      </div>
    </header>
  );
};
