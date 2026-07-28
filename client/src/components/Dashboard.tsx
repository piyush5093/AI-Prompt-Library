import React from 'react';
import { usePrompts } from '../context/PromptContext';

export const Dashboard: React.FC = () => {
  const { prompts, loading, error, addPrompt } = usePrompts();

  const totalPrompts = prompts.length;
  const favoritePrompts = prompts.filter(p => p.isFavorite).length;
  
  const activeCategoriesCount = new Set(prompts.map(p => p.category)).size;

  const recentlyAdded = [...prompts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleTestAdd = async () => {
    const timestamp = new Date().toLocaleTimeString();
    try {
      await addPrompt({
        title: `Test Prompt ${timestamp}`,
        content: `This is a test prompt content generated at ${timestamp}.`,
        category: 'Coding',
        tags: ['test', 'development'],
        description: 'Auto-generated test prompt to verify persistence.',
        isFavorite: Math.random() > 0.5,
        isPinned: false,
        order: prompts.length
      });
    } catch (err) {
      console.error('Failed to add prompt', err);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30 dark:bg-[#0a0a0a] text-slate-800 dark:text-zinc-200">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
            Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">
            Overview of your saved AI prompts
          </p>
        </div>
        <button
          onClick={handleTestAdd}
          className="bg-blue-600/80 hover:bg-blue-700/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-semibold py-2.5 px-4 rounded border border-blue-700/20 dark:border-zinc-700 transition-colors"
        >
          Test Add Prompt (Atlas Sync)
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111] p-6 rounded">
          <span className="text-xs font-semibold text-slate-400 dark:text-zinc-600 uppercase tracking-wider">
            Total Prompts
          </span>
          <div className="text-3xl font-bold mt-2 text-slate-900 dark:text-zinc-50">
            {loading && totalPrompts === 0 ? '...' : totalPrompts}
          </div>
        </div>

        <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111] p-6 rounded">
          <span className="text-xs font-semibold text-slate-400 dark:text-zinc-600 uppercase tracking-wider">
            Favorites
          </span>
          <div className="text-3xl font-bold mt-2 text-slate-900 dark:text-zinc-50">
            {loading && totalPrompts === 0 ? '...' : favoritePrompts}
          </div>
        </div>

        <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111] p-6 rounded">
          <span className="text-xs font-semibold text-slate-400 dark:text-zinc-600 uppercase tracking-wider">
            Active Categories
          </span>
          <div className="text-3xl font-bold mt-2 text-slate-900 dark:text-zinc-50">
            {loading && totalPrompts === 0 ? '...' : activeCategoriesCount}
          </div>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111] p-6 rounded">
        <h3 className="text-sm font-semibold text-slate-400 dark:text-zinc-600 uppercase tracking-wider mb-4">
          Recently Added
        </h3>
        {recentlyAdded.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-zinc-600">
            No prompts added yet. Click "Test Add Prompt" to create one.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {recentlyAdded.map(p => (
              <div
                key={p.id}
                className="border-b border-slate-100 dark:border-zinc-900 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-zinc-100 text-sm">
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-zinc-600 mt-0.5">
                      Category: {p.category} | Added: {new Date(p.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 line-clamp-2">
                      {p.content}
                    </p>
                  </div>
                  {p.isFavorite && (
                    <span className="text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-600 px-2 py-0.5 rounded">
                      Favorite
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
