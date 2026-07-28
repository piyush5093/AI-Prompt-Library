import type { Prompt } from '../types/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error: ${res.status}`);
  }
  return res.json();
};

export const fetchPrompts = async (): Promise<Prompt[]> => {
  const res = await fetch(`${API_BASE}/prompts`);
  return handleResponse(res);
};

export const createPrompt = async (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt> => {
  const res = await fetch(`${API_BASE}/prompts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt),
  });
  return handleResponse(res);
};

export const bulkCreatePrompts = async (prompts: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Prompt[]> => {
  const res = await fetch(`${API_BASE}/prompts/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompts),
  });
  return handleResponse(res);
};

export const updatePrompt = async (id: string, updates: Partial<Prompt>): Promise<Prompt> => {
  const res = await fetch(`${API_BASE}/prompts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
};

export const deletePrompt = async (id: string): Promise<{ message: string }> => {
  const res = await fetch(`${API_BASE}/prompts/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
};

export const reorderPrompts = async (updates: { id: string; order: number }[]): Promise<{ message: string }> => {
  const res = await fetch(`${API_BASE}/prompts/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
};
