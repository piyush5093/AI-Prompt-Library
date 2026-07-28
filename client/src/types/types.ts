export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isPinned: boolean;
  order: number;
}
