import React from 'react';
import type { Prompt } from '../types/types';
import { formatDate } from '../utils/dateUtils';
import { getCategoryBadgeColors } from '../utils/badgeColors';
import { usePrompts } from '../context/PromptContext';
import { useToast } from '../context/ToastContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  isDraggable?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onClick,
  onEdit,
  onDelete,
  isDraggable = true,
}) => {
  const { toggleFavorite, togglePin, addPrompt } = usePrompts();
  const { showToast } = useToast();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: prompt.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

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
      ref={setNodeRef}
      style={style}
      className={`group flex flex-col bg-white dark:bg-[#131313] rounded-lg border shadow-sm transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md cursor-pointer h-[280px] ${prompt.isPinned ? 'border-zinc-200 dark:border-zinc-800/80 border-l-4 border-l-amber-500' : 'border-zinc-200 dark:border-zinc-800/80'} overflow-hidden ${isDragging ? 'shadow-xl border-amber-500/50 opacity-80' : ''}`}
      onClick={onClick}
    >
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className={`shrink-0 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded ${getCategoryBadgeColors(prompt.category)}`}>
              {prompt.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-600 truncate">
              {formatDate(prompt.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
            <button
              onClick={handleTogglePin}
              className={`p-1.5 rounded transition-all duration-150 active:scale-110 ${prompt.isPinned ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
              title={prompt.isPinned ? "Unpin" : "Pin"}
              aria-label={prompt.isPinned ? "Unpin prompt" : "Pin prompt"}
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded transition-all duration-150 active:scale-110 ${prompt.isFavorite ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
              title={prompt.isFavorite ? "Unfavorite" : "Favorite"}
              aria-label={prompt.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className="w-4 h-4" fill={prompt.isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-lg mb-2 line-clamp-2 leading-tight">
          {prompt.title}
        </h3>
        
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4 flex-1 font-sans leading-relaxed">
          {prompt.content}
        </p>

        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto mb-1 overflow-hidden max-h-[22px]">
            {prompt.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[11px] bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-[11px] bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div 
        className="px-4 py-2.5 bg-stone-50 dark:bg-[#0a0a0a] border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          <button 
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            className={`p-1.5 transition-colors ${isDraggable ? 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-grab active:cursor-grabbing' : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'}`}
            title={isDraggable ? "Drag to reorder" : "Reordering disabled while filtered"}
            aria-label="Drag to reorder"
            disabled={!isDraggable}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button 
            onClick={handleCopy}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            title="Copy to clipboard"
            aria-label="Copy prompt content to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDuplicate}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            title="Duplicate"
            aria-label="Duplicate prompt"
          >
            <CopyPlus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleEdit}
            className="p-1.5 text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            title="Edit"
            aria-label="Edit prompt"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
            title="Delete"
            aria-label="Delete prompt"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
