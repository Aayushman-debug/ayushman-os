import { Router, Request, Response } from 'express';
import { initialVault } from '../data/initialData';
import { requireAdmin } from '../middleware/authorization';

const router = Router();
router.use(requireAdmin);
let vaultEntries = [...initialVault];

router.get('/', (_req: Request, res: Response) => {
  return res.json({ success: true, entries: vaultEntries });
});

router.post('/', (req: Request, res: Response) => {
  const { title, category, content, dateOccurred, tags, isPrivate } = req.body;
  const newEntry = {
    id: Date.now(),
    title: title || 'Memory Log',
    category: category || 'milestone',
    content: content || '',
    dateOccurred: dateOccurred || new Date().toISOString().split('T')[0],
    tags: Array.isArray(tags) ? tags : ['Personal'],
    isPrivate: isPrivate ?? true
  };
  vaultEntries.unshift(newEntry);
  return res.json({ success: true, entry: newEntry });
});

export default router;
