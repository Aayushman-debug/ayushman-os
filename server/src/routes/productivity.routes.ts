import { Router, Request, Response } from 'express';
import { initialCheckins, initialHabits, initialTasks, initialGoals } from '../data/initialData';
import { requireAdmin } from '../middleware/authorization';

const router = Router();
router.use(requireAdmin);
let checkins = [...initialCheckins];
let habits = [...initialHabits];
let tasks = [...initialTasks];
let goals = [...initialGoals];

// --- CHECK-INS ---
router.get('/checkins', (_req: Request, res: Response) => {
  return res.json({ success: true, checkins });
});

router.post('/checkins', (req: Request, res: Response) => {
  const { studyHours, topicsCompleted, questionsSolved, tasksCompleted, mood, energyLevel, sleepHours, journalEntry, tomorrowPriorities } = req.body;
  const newCheckin = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    studyHours: parseFloat(studyHours) || 0,
    topicsCompleted: topicsCompleted || '',
    questionsSolved: parseInt(questionsSolved, 10) || 0,
    tasksCompleted: parseInt(tasksCompleted, 10) || 0,
    mood: mood || 'Balanced',
    energyLevel: parseInt(energyLevel, 10) || 8,
    sleepHours: parseFloat(sleepHours) || 7,
    journalEntry: journalEntry || '',
    tomorrowPriorities: tomorrowPriorities || ''
  };
  checkins.unshift(newCheckin);
  return res.json({ success: true, checkin: newCheckin });
});

// --- HABITS ---
router.get('/habits', (_req: Request, res: Response) => {
  return res.json({ success: true, habits });
});

router.post('/habits/:id/toggle', (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const habit = habits.find(h => h.id === id);
  if (habit) {
    habit.streak += 1;
    return res.json({ success: true, habit });
  }
  return res.status(404).json({ success: false, message: 'Habit not found' });
});

// --- TASKS ---
router.get('/tasks', (_req: Request, res: Response) => {
  return res.json({ success: true, tasks });
});

router.post('/tasks', (req: Request, res: Response) => {
  const { title, description, priority, tag, dueDate } = req.body;
  const newTask = {
    id: Date.now(),
    title: title || 'New Task',
    description: description || '',
    priority: priority || 'medium',
    status: 'todo',
    tag: tag || 'General',
    dueDate: dueDate || new Date().toISOString().split('T')[0]
  };
  tasks.unshift(newTask);
  return res.json({ success: true, task: newTask });
});

router.patch('/tasks/:id/status', (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const { status } = req.body;
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = status;
    return res.json({ success: true, task });
  }
  return res.status(404).json({ success: false, message: 'Task not found' });
});

router.delete('/tasks/:id', (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  tasks = tasks.filter(t => t.id !== id);
  return res.json({ success: true, message: 'Task deleted' });
});

// --- GOALS ---
router.get('/goals', (_req: Request, res: Response) => {
  return res.json({ success: true, goals });
});

export default router;
