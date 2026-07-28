import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Prompt } from '../types/types';
import * as api from '../services/promptService';

interface PromptContextType {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  loadPrompts: () => Promise<void>;
  addPrompt: (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  bulkAddPrompts: (prompts: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
  editPrompt: (id: string, updates: Partial<Prompt>) => Promise<void>;
  removePrompt: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  reorder: (newPrompts: Prompt[]) => Promise<void>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prompts, setPrompts] = useState<Prompt[]>(() => {
    const cached = localStorage.getItem('prompts');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const saveLocally = (list: Prompt[]) => {
    setPrompts(list);
    localStorage.setItem('prompts', JSON.stringify(list));
  };

  const loadPrompts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchPrompts();
      saveLocally(data);
      setIsOffline(false);
    } catch (err: any) {
      setIsOffline(true);
      setError(err.message || 'Failed to fetch prompts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const addPrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    setError(null);
    const tempId = `temp-${Date.now()}`;
    const tempPrompt: Prompt = {
      ...promptData,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [...prompts, tempPrompt];
    saveLocally(updatedList);

    try {
      const saved = await api.createPrompt(promptData);
      const syncedList = updatedList.map(p => (p.id === tempId ? saved : p));
      saveLocally(syncedList);
    } catch (err: any) {
      setError(err.message || 'Failed to create prompt on server');
      saveLocally(prompts);
      throw err;
    }
  };

  const editPrompt = async (id: string, updates: Partial<Prompt>) => {
    setError(null);
    const originalList = [...prompts];
    const updatedList = prompts.map(p => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    saveLocally(updatedList);

    try {
      const saved = await api.updatePrompt(id, updates);
      const syncedList = updatedList.map(p => (p.id === id ? saved : p));
      saveLocally(syncedList);
    } catch (err: any) {
      setError(err.message || 'Failed to update prompt on server');
      saveLocally(originalList);
      throw err;
    }
  };

  const removePrompt = async (id: string) => {
    setError(null);
    const originalList = [...prompts];
    const updatedList = prompts.filter(p => p.id !== id);
    saveLocally(updatedList);

    try {
      await api.deletePrompt(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete prompt on server');
      saveLocally(originalList);
      throw err;
    }
  };

  const toggleFavorite = async (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) return;
    await editPrompt(id, { isFavorite: !prompt.isFavorite });
  };

  const togglePin = async (id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) return;
    await editPrompt(id, { isPinned: !prompt.isPinned });
  };

  const reorder = async (newPrompts: Prompt[]) => {
    setError(null);
    const originalList = [...prompts];
    const indexed = newPrompts.map((p, index) => ({ ...p, order: index }));
    saveLocally(indexed);

    try {
      const updates = indexed.map(p => ({ id: p.id, order: p.order }));
      await api.reorderPrompts(updates);
    } catch (err: any) {
      setError(err.message || 'Failed to save reorder on server');
      saveLocally(originalList);
      throw err;
    }
  };

  const bulkAddPrompts = async (newPrompts: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    setError(null);
    const originalList = [...prompts];
    
    // Optimistic UI temp entries
    const tempPrompts: Prompt[] = newPrompts.map((p, index) => ({
      ...p,
      id: `temp-bulk-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const updatedList = [...prompts, ...tempPrompts];
    saveLocally(updatedList);

    try {
      const savedPrompts = await api.bulkCreatePrompts(newPrompts);
      // Replace all temporary items with saved ones (append to original list)
      const syncedList = [...originalList, ...savedPrompts];
      saveLocally(syncedList);
    } catch (err: any) {
      setError(err.message || 'Failed to bulk create prompts on server');
      saveLocally(originalList);
      throw err;
    }
  };

  return (
    <PromptContext.Provider
      value={{
        prompts,
        loading,
        error,
        isOffline,
        loadPrompts,
        addPrompt,
        bulkAddPrompts,
        editPrompt,
        removePrompt,
        toggleFavorite,
        togglePin,
        reorder,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompts = () => {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error('usePrompts must be used within a PromptProvider');
  }
  return context;
};
