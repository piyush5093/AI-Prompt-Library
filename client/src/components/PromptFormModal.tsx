import React, { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import type { Prompt } from '../types/types';
import { useToast } from '../context/ToastContext';
import { usePrompts } from '../context/PromptContext';

interface PromptFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Prompt | null;
}

const CATEGORIES = [
  'Coding', 'Marketing', 'Content Writing', 'Email', 'Resume',
  'SQL', 'Design', 'Social Media', 'Productivity', 'Others'
];

export const PromptFormModal: React.FC<PromptFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { addPrompt, editPrompt } = usePrompts();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');

  const [touched, setTouched] = useState({ title: false, content: false, category: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
        setCategory(initialData.category);
        setTags(initialData.tags.join(', '));
        setDescription(initialData.description);
      } else {
        setTitle('');
        setContent('');
        setCategory('');
        setTags('');
        setDescription('');
      }
      setTouched({ title: false, content: false, category: false });
      setSubmitError(null);
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, initialData]);

  // Trap focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || e.key !== 'Tab' || !modalRef.current) return;
      
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
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

  if (!isOpen) return null;

  const validate = () => {
    const errors: { title?: string; content?: string; category?: string } = {};
    if (!title.trim()) errors.title = 'Title is required';
    else if (title.length > 100) errors.title = 'Title must be 100 characters or less';
    
    if (!content.trim()) errors.content = 'Content is required';
    else if (content.length < 10) errors.content = 'Content must be at least 10 characters';
    
    if (!category) errors.category = 'Category is required';
    else if (!CATEGORIES.includes(category)) errors.category = 'Invalid category';

    return errors;
  };

  const errors = validate();

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, content: true, category: true });
    setSubmitError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const parsedTags = tags
        .split(/[,\n]+/)
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const promptData = {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: parsedTags,
        description: description.trim(),
        isFavorite: initialData ? initialData.isFavorite : false,
        isPinned: initialData ? initialData.isPinned : false,
        order: initialData ? initialData.order : 0,
      };

      if (initialData) {
        await editPrompt(initialData.id, promptData);
        showToast('Prompt updated successfully', 'success');
      } else {
        await addPrompt(promptData);
        showToast('Prompt created successfully', 'success');
      }
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4 overflow-y-auto transition-opacity duration-200">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-[#131313] w-full h-full md:h-auto md:max-w-2xl md:rounded-lg border-0 md:border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl relative overflow-y-auto flex flex-col justify-between md:justify-start transform transition-transform duration-200 scale-100"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
          {isEditing ? 'Edit Prompt' : 'New Prompt'}
        </h2>

        {submitError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded text-sm font-medium">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Title *
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={() => handleBlur('title')}
              className={`w-full px-3 py-2 border rounded bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 transition-colors ${touched.title && errors.title ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500'}`}
              placeholder="E.g., Generate React Component"
            />
            {touched.title && errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Content *
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              onBlur={() => handleBlur('content')}
              rows={6}
              className={`w-full px-3 py-2 border rounded bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-1 transition-colors ${touched.content && errors.content ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500'}`}
              placeholder="Enter the actual prompt text here..."
            />
            {touched.content && errors.content && (
              <p className="text-xs text-red-500 mt-1">{errors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                onBlur={() => handleBlur('category')}
                className={`w-full px-3 py-2 border rounded bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 transition-colors ${touched.category && errors.category ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500'}`}
              >
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {touched.category && errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                placeholder="react, frontend, hooks"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              placeholder="Brief summary of what this does"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                isEditing ? 'Save Changes' : 'Create Prompt'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
