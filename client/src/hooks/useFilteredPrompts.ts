import { useMemo } from 'react';
import type { Prompt } from '../types/types';

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';

export function useFilteredPrompts(
  prompts: Prompt[],
  searchTerm: string,
  categoryFilter: string | null,
  favoritesOnly: boolean,
  sortOption: SortOption
) {
  return useMemo(() => {
    // 1. Filter
    let filtered = prompts.filter(p => {
      // Favorites filter
      if (favoritesOnly && !p.isFavorite) return false;
      
      // Category filter
      if (categoryFilter && p.category !== categoryFilter) return false;
      
      // Search term filter (title + content)
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        const titleMatch = p.title.toLowerCase().includes(lowerSearch);
        const contentMatch = p.content.toLowerCase().includes(lowerSearch);
        if (!titleMatch && !contentMatch) return false;
      }
      
      return true;
    });

    // 2. Separate pinned and unpinned
    const pinned = filtered.filter(p => p.isPinned);
    const unpinned = filtered.filter(p => !p.isPinned);

    // 3. Sort function
    const sortFn = (a: Prompt, b: Prompt) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'a-z':
          return a.title.localeCompare(b.title);
        case 'z-a':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    };

    // 4. Sort internally and combine
    pinned.sort(sortFn);
    unpinned.sort(sortFn);

    return [...pinned, ...unpinned];
  }, [prompts, searchTerm, categoryFilter, favoritesOnly, sortOption]);
}
