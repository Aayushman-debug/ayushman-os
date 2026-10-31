import { Router, Request, Response } from 'express';
import { initialSkills, initialProjects } from '../data/initialData';

import { requireAdmin } from '../middleware/authorization';

const router = Router();
let skills = [...initialSkills];
let projects = [...initialProjects];

router.get('/skills', (_req: Request, res: Response) => {
  return res.json({ success: true, skills });
});

router.get('/projects', (_req: Request, res: Response) => {
  return res.json({ success: true, projects });
});

router.post('/projects', requireAdmin, (req: Request, res: Response) => {
  const { title, tag, description, technologies, githubUrl, liveUrl, imageUrl } = req.body;
  const newProj = {
    id: Date.now(),
    title: title || 'New Project',
    tag: tag || 'Engineering Project',
    description: description || '',
    technologies: Array.isArray(technologies) ? technologies : ['React', 'TypeScript'],
    githubUrl: githubUrl || '',
    liveUrl: liveUrl || '#',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
    featured: true
  };
  projects.unshift(newProj);
  return res.json({ success: true, project: newProj });
});

export default router;
