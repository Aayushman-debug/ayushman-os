import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Plus, 
  Trash2, 
  Clock, 
  Smile, 
  Moon, 
  Calendar,
  Sparkles,
  ArrowRight,
  ListTodo
} from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { ActionCard } from '@/components/ui/cards';
import { PageTransition } from '@/components/ui/page-transition';

export const ProductivityPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  
  // Form State for new check-in
  const [studyHours, setStudyHours] = useState('7.0');
  const [topicsCompleted, setTopicsCompleted] = useState('');
  const [questionsSolved, setQuestionsSolved] = useState('6');
  const [mood, setMood] = useState('Focused');
  const [journalEntry, setJournalEntry] = useState('');
  const [tomorrowPriorities, setTomorrowPriorities] = useState('');

  // Form State for new task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('Academics');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  useEffect(() => {
    fetch('/api/productivity/tasks').then(r => r.json()).then(d => d.tasks && setTasks(d.tasks));
    fetch('/api/productivity/habits').then(r => r.json()).then(d => d.habits && setHabits(d.habits));
    fetch('/api/productivity/checkins').then(r => r.json()).then(d => d.checkins && setCheckins(d.checkins));
  }, []);

  const handleCreateCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/productivity/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studyHours,
          topicsCompleted,
          questionsSolved,
          mood,
          journalEntry,
          tomorrowPriorities,
          tasksCompleted: 4,
          energyLevel: 8,
          sleepHours: 7.5
        })
      });
      const data = await res.json();
      if (data.success) {
        setCheckins([data.checkin, ...checkins]);
        setTopicsCompleted('');
        setJournalEntry('');
        setTomorrowPriorities('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const res = await fetch('/api/productivity/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          tag: newTaskTag,
          priority: newTaskPriority,
        })
      });
      const data = await res.json();
      if (data.success) {
        setTasks([data.task, ...tasks]);
        setNewTaskTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/productivity/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`/api/productivity/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHabit = async (id: number) => {
    try {
      const res = await fetch(`/api/productivity/habits/${id}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setHabits(habits.map(h => h.id === id ? { ...h, streak: h.streak + 1 } : h));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'todo', title: 'To Do', color: 'border-purple-500/30' },
    { key: 'in_progress', title: 'In Progress', color: 'border-cyan-500/30' },
    { key: 'completed', title: 'Completed', color: 'border-emerald-500/30' }
  ];

  return (
    <PageTransition>
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl backdrop-blur-md">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-3">
              <ListTodo className="size-3.5" />
              <span>Personal Execution & Tracking</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Journal & Tasks
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Daily engineering check-ins, habit streaks, and kanban task management.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center shadow-lg">
              <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                <Flame className="size-5" />
                <span>26</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">Coding Streak</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center shadow-lg">
              <div className="text-2xl font-black text-cyan-400">
                {checkins[0]?.studyHours || 7.0}h
              </div>
              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">Focus Today</div>
            </div>
          </div>
        </div>

        {/* Habits Bar with Tactile ActionCards */}
        <div className="p-6 rounded-3xl bg-[#0b0e18]/80 border border-white/10 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Flame className="size-4 text-amber-400" />
              <span>Active Habit Streaks</span>
            </h3>
            <span className="text-xs font-mono text-neutral-500">Tap card to increment streak</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {habits.map((habit) => (
              <ActionCard
                key={habit.id}
                title={habit.title}
                subtitle={`${habit.streak} Days · ${habit.category}`}
                onToggle={() => toggleHabit(habit.id)}
                actionNode={
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition">
                    +1
                  </span>
                }
              />
            ))}
          </div>
        </div>

        {/* Main Grid: Kanban Tasks + Check-in Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kanban Board (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Kanban Task Board</span>
                <span className="text-xs font-mono text-neutral-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  {tasks.length} total
                </span>
              </h3>
            </div>

            {/* Quick Add Task */}
            <form onSubmit={handleCreateTask} className="p-4 rounded-2xl bg-[#0b0e18]/80 border border-white/10 flex flex-wrap gap-2.5 items-center shadow-lg">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add new task (e.g. 'Solve 3 LeetCode Graph problems')..."
                className="flex-1 min-w-[200px] bg-black/40 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
              />
              <select
                value={newTaskTag}
                onChange={(e) => setNewTaskTag(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="Academics">Academics</option>
                <option value="DSA">DSA</option>
                <option value="Projects">Projects</option>
                <option value="Gaming">Gaming</option>
                <option value="General">General</option>
              </select>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Add Task</span>
              </button>
            </form>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {columns.map((col) => {
                const colTasks = tasks.filter(t => t.status === col.key);
                return (
                  <div key={col.key} className={`p-4 rounded-2xl bg-[#0b0e18]/80 border ${col.color} min-h-[350px] flex flex-col shadow-lg backdrop-blur-md`}>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono">
                        {col.title}
                      </span>
                      <span className="text-[11px] font-mono bg-white/5 px-2 py-0.5 rounded-full text-neutral-400">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1 overflow-y-auto">
                      {colTasks.map((task) => (
                        <div key={task.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition group">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-medium text-white">{task.title}</span>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/5 text-[10px]">
                            <span className="px-1.5 py-0.2 rounded bg-white/5 text-purple-300 font-mono">
                              {task.tag}
                            </span>

                            <div className="flex items-center gap-1">
                              {col.key !== 'todo' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'todo')}
                                  className="text-neutral-500 hover:text-white px-1 cursor-pointer"
                                  title="Move to Todo"
                                >
                                  ←
                                </button>
                              )}
                              {col.key !== 'in_progress' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                  className="text-neutral-500 hover:text-cyan-400 px-1 font-mono cursor-pointer"
                                  title="Move to In Progress"
                                >
                                  ⚡
                                </button>
                              )}
                              {col.key !== 'completed' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'completed')}
                                  className="text-neutral-500 hover:text-emerald-400 px-1 cursor-pointer"
                                  title="Mark Completed"
                                >
                                  →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Daily Check-in Form & History */}
          <div className="space-y-6">
            <SpotlightCard
              enableTilt={false}
              spotlightColor="rgba(6, 182, 212, 0.15)"
              className="p-6 rounded-2xl bg-[#0b0e18]/80 border-white/10 shadow-xl backdrop-blur-md"
            >
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                <Calendar className="size-4 text-cyan-400" />
                <span>Daily Log Check-in</span>
              </h3>

              <form onSubmit={handleCreateCheckin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Study Hours Logged</label>
                  <input
                    type="number"
                    step="0.5"
                    value={studyHours}
                    onChange={(e) => setStudyHours(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Questions / LeetCode Solved</label>
                  <input
                    type="number"
                    value={questionsSolved}
                    onChange={(e) => setQuestionsSolved(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Topics Completed</label>
                  <input
                    type="text"
                    value={topicsCompleted}
                    onChange={(e) => setTopicsCompleted(e.target.value)}
                    placeholder="e.g. Compiler SLR parser, DP Knapsack..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Today's Reflection / Journal</label>
                  <textarea
                    rows={2}
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="Insights, breakthrough moments, lessons learned..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Tomorrow's Priorities</label>
                  <input
                    type="text"
                    value={tomorrowPriorities}
                    onChange={(e) => setTomorrowPriorities(e.target.value)}
                    placeholder="The #1 objective for tomorrow..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-neutral-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  Save Check-in
                </button>
              </form>
            </SpotlightCard>

            {/* Recent Check-ins History */}
            <div className="p-6 rounded-2xl bg-[#0b0e18]/80 border border-white/10 shadow-xl backdrop-blur-md">
              <h4 className="text-xs font-bold text-neutral-400 uppercase font-mono tracking-wider mb-3">
                Recent Logs
              </h4>
              <div className="space-y-3">
                {checkins.slice(0, 3).map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1 hover:border-purple-500/30 transition">
                    <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px]">
                      <span className="text-purple-300 font-bold">{c.date}</span>
                      <span className="text-cyan-400">{c.studyHours} hrs</span>
                    </div>
                    <p className="text-neutral-300 text-xs font-medium">{c.topicsCompleted}</p>
                    {c.journalEntry && (
                      <p className="text-neutral-400 text-[11px] italic">"{c.journalEntry}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </PageTransition>
  );
};
export default ProductivityPage;
