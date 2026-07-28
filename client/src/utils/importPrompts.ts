import type { Prompt } from '../types/types';

const VALID_CATEGORIES = [
  'Coding', 'Marketing', 'Content Writing', 'Email', 'Resume',
  'SQL', 'Design', 'Social Media', 'Productivity', 'Others'
];

export const importPrompts = (file: File): Promise<Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') {
        return reject(new Error('Failed to read file.'));
      }

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        return reject(new Error('File could not be read as JSON.'));
      }

      if (!Array.isArray(parsed)) {
        return reject(new Error('Invalid format: File must contain a JSON array of prompts.'));
      }

      if (parsed.length === 0) {
        return reject(new Error('No prompts found in file.'));
      }

      const validPrompts: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>[] = [];

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        
        if (!item || typeof item !== 'object') {
          return reject(new Error(`Item at index ${i} is not a valid object.`));
        }

        if (typeof item.title !== 'string' || !item.title.trim()) {
          return reject(new Error(`Item at index ${i} has an invalid or missing title.`));
        }

        if (typeof item.content !== 'string' || !item.content.trim()) {
          return reject(new Error(`Item at index ${i} has an invalid or missing content.`));
        }

        if (typeof item.category !== 'string' || !VALID_CATEGORIES.includes(item.category)) {
          return reject(new Error(`Item at index ${i} has an invalid category: '${item.category}'.`));
        }

        if (item.tags !== undefined) {
          if (!Array.isArray(item.tags) || !item.tags.every((t: any) => typeof t === 'string')) {
            return reject(new Error(`Item at index ${i} has invalid tags (must be an array of strings).`));
          }
        }

        if (item.description !== undefined && typeof item.description !== 'string') {
          return reject(new Error(`Item at index ${i} has an invalid description (must be a string).`));
        }

        validPrompts.push({
          title: item.title,
          content: item.content,
          category: item.category,
          tags: item.tags || [],
          description: item.description || '',
          isFavorite: false,
          isPinned: false,
          order: 999999, // High order to append at the end
        });
      }

      resolve(validPrompts);
    };

    reader.onerror = () => {
      reject(new Error('An error occurred while reading the file.'));
    };

    reader.readAsText(file);
  });
};
