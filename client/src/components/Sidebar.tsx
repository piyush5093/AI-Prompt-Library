import React from 'react';

const CATEGORIES = [
  'Coding', 'Marketing', 'Content Writing', 'Email', 'Resume',
  'SQL', 'Design', 'Social Media', 'Productivity', 'Others'
];

interface SidebarProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  favoritesOnly: boolean;
  onFavoritesChange: (onlyFavorites: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onCategoryChange,
  favoritesOnly,
  onFavoritesChange,
}) => {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#0b0b0b] p-6 flex flex-col gap-6">
      <div>
        <label className="flex items-center gap-3 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => onFavoritesChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 dark:border-zinc-700 text-amber-500 focus:ring-0 focus:ring-offset-0 bg-transparent transition-colors"
          />
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 dark:text-zinc-300 dark:group-hover:text-zinc-100 transition-colors">
            Favorites Only
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-slate-400 dark:text-zinc-600 uppercase tracking-wider mb-2">
          Categories
        </span>
        <button
          onClick={() => onCategoryChange(null)}
          className={`text-left py-1.5 px-3 rounded text-sm font-medium transition-colors ${
            activeCategory === null
              ? 'bg-slate-200/50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900'
          }`}
        >
          All Prompts
        </button>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`text-left py-1.5 px-3 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-slate-200/50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-medium'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
