import React, { useState } from 'react';
import { usePrompts } from '../context/PromptContext';
import { PromptCard } from './PromptCard';
import { PromptDetailsModal } from './PromptDetailsModal';
import { PromptFormModal } from './PromptFormModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import type { Prompt } from '../types/types';

export const Dashboard: React.FC = () => {
  const { prompts, loading, error, removePrompt } = usePrompts();

  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);

  const totalPrompts = prompts.length;
  const favoritePrompts = prompts.filter(p => p.isFavorite).length;
  const activeCategoriesCount = new Set(prompts.map(p => p.category)).size;

  const sortedPrompts = [...prompts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleCardClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsDetailsOpen(true);
  };

  const handleEditClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsEditFormOpen(true);
  };

  const handleDeleteClick = (prompt: Prompt) => {
    setPromptToDelete(prompt);
  };

  const confirmDelete = async () => {
    if (promptToDelete) {
      try {
        await removePrompt(promptToDelete.id);
      } catch (e) {
        console.error(e);
      }
    }
    setPromptToDelete(null);
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

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-400 dark:text-zinc-600 uppercase tracking-wider mb-4">
          All Prompts
        </h3>
        {sortedPrompts.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-zinc-600 p-8 border border-slate-200 dark:border-zinc-800 border-dashed rounded text-center">
            No prompts found. Click "New Prompt" to create one.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPrompts.map(p => (
              <PromptCard
                key={p.id}
                prompt={p}
                onClick={() => handleCardClick(p)}
                onEdit={() => handleEditClick(p)}
                onDelete={() => handleDeleteClick(p)}
              />
            ))}
          </div>
        )}
      </div>

      <PromptDetailsModal
        prompt={selectedPrompt}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={() => {
          setIsDetailsOpen(false);
          setIsEditFormOpen(true);
        }}
      />

      <PromptFormModal
        initialData={selectedPrompt}
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
      />

      <DeleteConfirmDialog
        isOpen={!!promptToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setPromptToDelete(null)}
      />
    </div>
  );
};
