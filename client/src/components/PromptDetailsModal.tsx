import React, { useEffect, useRef } from 'react';
import type { Prompt } from '../types/types';
import { formatRelativeDate } from '../utils/dateUtils';
import { useToast } from '../context/ToastContext';
import { Copy, Edit2, X } from 'lucide-react';

interface PromptDetailsModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const PromptDetailsModal: React.FC<PromptDetailsModalProps> = ({
  prompt,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || e.key !== 'Tab' || !modalRef.current) return;
      
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content).then(() => {
      showToast('Copied to clipboard', 'success');
    }).catch(() => {
      showToast('Failed to copy to clipboard', 'error');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-[#111] border border-slate-200 dark:border-zinc-800 rounded p-6 shadow-xl w-full max-w-2xl my-auto relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2 pr-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 leading-tight">
              {prompt.title}
            </h2>
            {prompt.isFavorite && (
              <span className="text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-600 px-2 py-0.5 rounded">
                Favorite
              </span>
            )}
            {prompt.isPinned && (
              <span className="text-xs font-semibold bg-slate-200 border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 px-2 py-0.5 rounded">
                Pinned
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 mb-4">
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded border border-slate-200 dark:border-zinc-700">
              {prompt.category}
            </span>
            <span>•</span>
            <span>Updated {formatRelativeDate(prompt.updatedAt)}</span>
          </div>
          {prompt.description && (
            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-4">
              {prompt.description}
            </p>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded p-4 mb-4">
          <pre className="text-sm text-slate-800 dark:text-zinc-200 whitespace-pre-wrap font-sans">
            {prompt.content}
          </pre>
        </div>

        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {prompt.tags.map(tag => (
              <span key={tag} className="text-xs bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit();
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded bg-slate-700 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
