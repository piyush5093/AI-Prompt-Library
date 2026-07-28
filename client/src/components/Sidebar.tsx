import React from 'react';

const CATEGORIES = [
  'Coding', 'Marketing', 'Content Writing', 'Email', 'Resume',
  'SQL', 'Design', 'Social Media', 'Productivity', 'Others'
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#0b0b0b] p-6 flex flex-col gap-6">
      <div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-500 focus:ring-0 focus:ring-offset-0 bg-transparent"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
            Favorites Only
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-400 dark:text-zinc-600 uppercase tracking-wider mb-2">
          Categories
        </span>
        <button className="text-left py-1.5 px-3 rounded text-sm bg-slate-200/50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-medium">
          All Prompts
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className="text-left py-1.5 px-3 rounded text-sm text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>
    </aside>
  );
};
