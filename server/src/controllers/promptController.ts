import { Request, Response } from 'express';
import { Prompt } from '../models/Prompt';

const handleError = (res: Response, err: any) => {
  res.status(500).json({ error: 'Internal server error occurred' });
};

export const getPrompts = async (req: Request, res: Response) => {
  try {
    const list = await Prompt.find().sort({ order: 1 });
    res.json(list);
  } catch (err) {
    handleError(res, err);
  }
};

export const createPrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, category, tags, description, isFavorite, isPinned, order } = req.body;
    
    if (!title || !content || !category) {
      res.status(400).json({ error: 'Title, content, and category are required' });
      return;
    }

    const newPrompt = new Prompt({
      title,
      content,
      category,
      tags,
      description,
      isFavorite,
      isPinned,
      order
    });

    const saved = await newPrompt.save();
    res.status(201).json(saved);
  } catch (err) {
    handleError(res, err);
  }
};

export const updatePrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const pId = req.params.id;
    const updated = await Prompt.findByIdAndUpdate(pId, req.body, { new: true, runValidators: true });
    
    if (!updated) {
      res.status(404).json({ error: 'Prompt not found' });
      return;
    }
    
    res.json(updated);
  } catch (err) {
    handleError(res, err);
  }
};

export const deletePrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const promptId = req.params.id;
    const deleted = await Prompt.findByIdAndDelete(promptId);
    
    if (!deleted) {
      res.status(404).json({ error: 'Prompt not found' });
      return;
    }
    
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};

export const reorderPrompts = async (req: Request, res: Response): Promise<void> => {
  try {
    const updates: { id: string, order: number }[] = req.body;
    
    if (!Array.isArray(updates)) {
      res.status(400).json({ error: 'Expected an array of {id, order}' });
      return;
    }

    const bulkOps = updates.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order }
      }
    }));

    if (bulkOps.length > 0) {
      await Prompt.bulkWrite(bulkOps);
    }
    
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    handleError(res, err);
  }
};
