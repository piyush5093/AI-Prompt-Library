import React, { useState } from 'react';
import { usePrompts } from '../context/PromptContext';
import { useToast } from '../context/ToastContext';
import { PromptCard } from './PromptCard';
import { PromptDetailsModal } from './PromptDetailsModal';
import { PromptFormModal } from './PromptFormModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { SearchBar } from './SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { useFilteredPrompts } from '../hooks/useFilteredPrompts';
import type { SortOption } from '../hooks/useFilteredPrompts';
import type { Prompt } from '../types/types';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

interface DashboardProps {
  categoryFilter: string | null;
  favoritesOnly: boolean;
  onClearFilters: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  categoryFilter,
  favoritesOnly,
  onClearFilters,
}) => {
  const { prompts, loading, error, isOffline, loadPrompts, removePrompt, reorder } = usePrompts();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredPrompts = useFilteredPrompts(
    prompts,
    debouncedSearchTerm,
    categoryFilter,
    favoritesOnly,
    sortOption
  );

  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);

  const totalPrompts = prompts.length;
  const favoritePrompts = prompts.filter(p => p.isFavorite).length;
  const activeCategoriesCount = new Set(prompts.map(p => p.category)).size;
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentlyAddedCount = prompts.filter(p => new Date(p.createdAt) >= sevenDaysAgo).length;

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

  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (promptToDelete) {
      setIsDeleting(true);
      try {
        await removePrompt(promptToDelete.id);
      } catch (e) {
        console.error(e);
      } finally {
        setIsDeleting(false);
      }
    }
    setPromptToDelete(null);
  };

  // DND setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const isFilterActive = !!categoryFilter || favoritesOnly || !!debouncedSearchTerm;
  const isDraggable = !isFilterActive;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredPrompts.findIndex(p => p.id === active.id);
    const newIndex = filteredPrompts.findIndex(p => p.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;
    
    const activeItem = filteredPrompts[oldIndex];
    const overItem = filteredPrompts[newIndex];

    // Prevent dragging across pinned/unpinned boundaries
    if (activeItem.isPinned !== overItem.isPinned) return;

    // We only reorder within the specific group (pinned or unpinned)
    const isPinnedGroup = activeItem.isPinned;
    const groupItems = filteredPrompts.filter(p => p.isPinned === isPinnedGroup);
    
    const groupOldIndex = groupItems.findIndex(p => p.id === active.id);
    const groupNewIndex = groupItems.findIndex(p => p.id === over.id);

    const reorderedGroup = arrayMove(groupItems, groupOldIndex, groupNewIndex);

    // Re-calculate the absolute array order
    const otherGroup = filteredPrompts.filter(p => p.isPinned !== isPinnedGroup);
    
    // Combine them back in standard order (pinned first)
    const combined = isPinnedGroup ? [...reorderedGroup, ...otherGroup] : [...otherGroup, ...reorderedGroup];
    
    // Assign sequential order values based on the newly combined array
    // We update all prompts in this list to ensure absolute sequential order is maintained
    const newPromptsWithOrder = combined.map((p, idx) => ({ ...p, order: idx }));
    
    reorder(newPromptsWithOrder).catch((err) => {
      console.error(err);
      showToast('Failed to reorder prompts', 'error');
    });
    setSortOption('custom');
  };

  const pinnedPrompts = filteredPrompts.filter(p => p.isPinned);
  const unpinnedPrompts = filteredPrompts.filter(p => !p.isPinned);

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-stone-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-200 transition-colors duration-300">
      <div className="flex justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
            Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">
            Overview of your saved AI prompts
          </p>
        </div>
        
        <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="w-32 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md leading-5 bg-white dark:bg-[#131313] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-colors cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A to Z</option>
            <option value="z-a">Z to A</option>
            <option value="custom">Custom Order</option>
          </select>
        </div>
      </div>

      {isOffline && (
        <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded text-sm flex items-center justify-between" role="status">
          <span>Working offline — changes will sync when connection is restored</span>
          <button 
            onClick={() => loadPrompts()} 
            className="text-xs underline hover:no-underline font-semibold"
            aria-label="Retry connection to server"
          >
            Retry connection
          </button>
        </div>
      )}

      {error && !isOffline && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Stat Cards - Unfiltered Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#131313] shadow-sm hover:shadow-md transition-all duration-200 p-6 rounded-lg">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Total Prompts
          </span>
          <div className="text-3xl font-bold mt-2 text-slate-900 dark:text-zinc-50">
            {loading && totalPrompts === 0 ? '...' : totalPrompts}
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#131313] shadow-sm hover:shadow-md transition-all duration-200 p-6 rounded-lg">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Favorites
          </span>
          <div className="text-3xl font-bold mt-2 text-slate-900 dark:text-zinc-50">
            {loading && totalPrompts === 0 ? '...' : favoritePrompts}
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#131313] shadow-sm hover:shadow-md transition-all duration-200 p-6 rounded-lg">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Active Categories
          </span>
          <div className="text-3xl font-bold mt-2 text-slate-900 dark:text-zinc-50">
            {loading && totalPrompts === 0 ? '...' : activeCategoriesCount}
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#131313] shadow-sm hover:shadow-md transition-all duration-200 p-6 rounded-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider relative z-10">
            Recently Added (7d)
          </span>
          <div className="text-3xl font-bold mt-2 text-slate-900 dark:text-zinc-50 relative z-10">
            {loading && totalPrompts === 0 ? '...' : recentlyAddedCount}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-600 uppercase tracking-wider">
            {isFilterActive ? 'Search Results' : 'All Prompts'}
          </h3>
          {isFilterActive && (
            <button
              onClick={() => {
                onClearFilters();
                setSearchTerm('');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
        
        {loading && totalPrompts === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-[#111] border border-slate-200 dark:border-zinc-800 rounded h-[280px] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-16"></div>
                    <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-12"></div>
                  </div>
                  <div className="h-6 bg-slate-200 dark:bg-zinc-800 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-zinc-800">
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-24"></div>
                  <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <p className="text-slate-600 dark:text-zinc-400 font-medium mb-2">No prompts found</p>
            {isFilterActive ? (
              <p className="text-sm text-slate-500 dark:text-zinc-500">
                Try adjusting your search or{' '}
                <button 
                  onClick={() => {
                    onClearFilters();
                    setSearchTerm('');
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  clearing filters
                </button>
                .
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-zinc-500">
                You haven't added any prompts yet. Click "New Prompt" to get started.
              </p>
            )}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              {pinnedPrompts.length > 0 && (
                <SortableContext items={pinnedPrompts.map(p => p.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pinnedPrompts.map(p => (
                      <PromptCard
                        key={p.id}
                        prompt={p}
                        isDraggable={isDraggable}
                        onClick={() => handleCardClick(p)}
                        onEdit={() => handleEditClick(p)}
                        onDelete={() => handleDeleteClick(p)}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
              {unpinnedPrompts.length > 0 && (
                <SortableContext items={unpinnedPrompts.map(p => p.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {unpinnedPrompts.map(p => (
                      <PromptCard
                        key={p.id}
                        prompt={p}
                        isDraggable={isDraggable}
                        onClick={() => handleCardClick(p)}
                        onEdit={() => handleEditClick(p)}
                        onDelete={() => handleDeleteClick(p)}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
          </DndContext>
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
        isDeleting={isDeleting}
      />
    </div>
  );
};
