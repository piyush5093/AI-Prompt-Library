import React from 'react';
import { X } from 'lucide-react';

const CATEGORIES = [
  'Coding', 'Marketing', 'Content Writing', 'Email', 'Resume',
  'SQL', 'Design', 'Social Media', 'Productivity', 'Others'
];

interface SidebarProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  favoritesOnly: boolean;
  onFavoritesChange: (onlyFavorites: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onCategoryChange,
  favoritesOnly,
  onFavoritesChange,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#131313] p-6 flex flex-col gap-6
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:bg-white md:dark:bg-[#131313] md:flex
      `}>
        <div className="flex items-center justify-between md:hidden">
          <span className="font-bold text-zinc-900 dark:text-zinc-50">Filters</span>
          <button 
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => onFavoritesChange(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-amber-500 focus:ring-amber-500 bg-transparent transition-colors"
            />
            <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100 transition-colors">
              Favorites Only
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            Categories
          </span>
          <button
            onClick={() => onCategoryChange(null)}
            className={`text-left py-1.5 px-3 rounded text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
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
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
