import React from 'react';
import type { Prompt } from '../types/types';
import { formatRelativeDate } from '../utils/dateUtils';
import { usePrompts } from '../context/PromptContext';
import { useToast } from '../context/ToastContext';
import { 
  Star, 
  Pin, 
  Copy, 
  Edit2, 
  Trash2, 
  CopyPlus, 
  GripVertical 
} from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onClick,
  onEdit,
  onDelete,
}) => {
  const { toggleFavorite, togglePin, addPrompt } = usePrompts();
  const { showToast } = useToast();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.content).then(() => {
      showToast('Copied to clipboard', 'success');
    }).catch(() => {
      showToast('Failed to copy', 'error');
    });
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { id, createdAt, updatedAt, ...rest } = prompt;
      await addPrompt({
        ...rest,
        title: `${rest.title} (copy)`,
      });
      showToast('Prompt duplicated', 'success');
    } catch (err) {
      showToast('Failed to duplicate prompt', 'error');
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(prompt.id).catch(() => showToast('Failed to update favorite', 'error'));
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(prompt.id).catch(() => showToast('Failed to update pin', 'error'));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div 
      className={`group flex flex-col bg-white dark:bg-[#111] rounded border ${prompt.isPinned ? 'border-slate-400 dark:border-zinc-500 shadow-sm' : 'border-slate-200 dark:border-zinc-800'} overflow-hidden transition-all hover:border-slate-300 dark:hover:border-zinc-600 cursor-pointer h-[280px]`}
      onClick={onClick}
    >
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded">
              {prompt.category}
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-600 truncate">
              {formatRelativeDate(prompt.updatedAt)}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
            <button
              onClick={handleTogglePin}
              className={`p-1.5 rounded transition-colors ${prompt.isPinned ? 'text-slate-700 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-800' : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50'}`}
              title={prompt.isPinned ? "Unpin" : "Pin"}
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded transition-colors ${prompt.isFavorite ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50'}`}
              title={prompt.isFavorite ? "Unfavorite" : "Favorite"}
            >
              <Star className="w-4 h-4" fill={prompt.isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-zinc-50 text-lg mb-2 line-clamp-2 leading-tight">
          {prompt.title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-3 mb-4 flex-1 font-sans">
          {prompt.content}
        </p>

        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto mb-2 overflow-hidden max-h-[22px]">
            {prompt.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[11px] bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 text-slate-500 dark:text-zinc-400 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-[11px] bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 text-slate-500 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div 
        className="px-4 py-2 bg-slate-50 dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
            title="Drag to reorder"
            aria-label="Drag to reorder"
            style={{ cursor: 'grab' }}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button 
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDuplicate}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
            title="Duplicate"
          >
            <CopyPlus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleEdit}
            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
