import { Router } from 'express';
import { 
  getPrompts, 
  createPrompt, 
  updatePrompt, 
  deletePrompt, 
  reorderPrompts,
  bulkCreatePrompts
} from '../controllers/promptController';

const router = Router();

router.get('/', getPrompts);
router.post('/', createPrompt);
router.post('/bulk', bulkCreatePrompts);
router.patch('/reorder', reorderPrompts);
router.put('/:id', updatePrompt);
router.delete('/:id', deletePrompt);

export default router;
