import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  ArrowUpRight, 
  Gamepad2, 
  Code2, 
  ListTodo,
  TrendingUp,
  Award,
  Film,
  Globe2,
  RotateCcw,
  Move,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  ExternalLink,
  Layers,
  Calendar,
  FileCheck2,
  Star,
  Plus,
  LayoutGrid
} from 'lucide-react';
import { AsciiHero } from '@/components/dashboard/AsciiHero';
import { DraggableWidgetGrid, WidgetItem, WidgetSize } from '@/components/ui/draggable-widget-grid';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { HoloCard } from '@/components/ui/cards/holo-card';
import { PageTransition } from '@/components/ui/page-transition';
import { SmartImage } from '@/components/ui/smart-image';
import { useAuth } from '@/context/AuthContext';

interface DashboardWidgetItem extends WidgetItem {
  type: 
    | 'tasks' 
    | 'checkin' 
    | 'progress' 
    | 'academics' 
    | 'habits' 
    | 'gaming' 
    | 'entertainment' 
    | 'social'
    | 'projects' 
    | 'memories';
}

const DEFAULT_DASHBOARD_WIDGETS: DashboardWidgetItem[] = [
  { id: 'academics', size: 'wide', type: 'academics', label: 'Semester V Academic Command' },
  { id: 'habits', size: 'wide', type: 'habits', label: 'Discipline Streaks' },
  { id: 'gaming', size: 'wide', type: 'gaming', label: 'Gaming Collector Roster' },
  { id: 'entertainment', size: 'wide', type: 'entertainment', label: 'Anime Watchlist Strip' },
  { id: 'projects', size: 'wide', type: 'projects', label: 'Featured Projects' },
  { id: 'tasks', size: 'wide', type: 'tasks', label: 'Active Sprint Tasks' },
  { id: 'memories', size: 'wide', type: 'memories', label: 'Milestones & Records' },
  { id: 'social', size: 'wide', type: 'social', label: 'Social & Platforms' },
];

export const DashboardPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Welcome');
  const [habits, setHabits] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [checkin, setCheckin] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [anime, setAnime] = useState<any[]>([]);
  const [gaming, setGaming] = useState<any[]>([]);
  const [vault, setVault] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [examSchedule, setExamSchedule] = useState<any[]>([]);
  const [layoutMode, setLayoutMode] = useState<'bento' | 'draggable'>('bento');
  const [pulsingHabitId, setPulsingHabitId] = useState<number | null>(null);

  const [gridItems, setGridItems] = useState<DashboardWidgetItem[]>(() => {
    try {
      const saved = localStorage.getItem('ayushman_dashboard_widget_order_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DASHBOARD_WIDGETS;
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
      
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/productivity/habits').then(r => r.json()).then(d => d.habits && setHabits(d.habits)).catch(() => {});
    fetch('/api/productivity/tasks').then(r => r.json()).then(d => d.tasks && setTasks(d.tasks)).catch(() => {});
    fetch('/api/productivity/checkins').then(r => r.json()).then(d => d.checkins && d.checkins.length > 0 && setCheckin(d.checkins[0])).catch(() => {});
    fetch('/api/developer/projects').then(r => r.json()).then(d => d.projects && setProjects(d.projects)).catch(() => {});
    fetch('/api/entertainment/anime').then(r => r.json()).then(d => d.anime && setAnime(d.anime)).catch(() => {});
    fetch('/api/gaming').then(r => r.json()).then(d => d.profiles && setGaming(d.profiles)).catch(() => {});
    fetch('/api/vault').then(r => r.json()).then(d => d.entries && setVault(d.entries)).catch(() => {});
    fetch('/api/academics/semesters').then(r => r.json()).then(d => {
      if (d.semesters) setSemesters(d.semesters);
      if (d.examSchedule) setExamSchedule(d.examSchedule);
    }).catch(() => {});
  }, []);

  const handleToggleHabit = async (id: number) => {
    if (!isAdmin) return;
    setPulsingHabitId(id);
    setTimeout(() => setPulsingHabitId(null), 500);
    try {
      const res = await fetch(`/api/productivity/habits/${id}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, streak: h.streak + 1 } : h));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTask = async (id: number, currentStatus: string) => {
    if (!isAdmin) return;
    const newStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
    try {
      await fetch(`/api/productivity/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const handleGridChange = useCallback((newItems: DashboardWidgetItem[]) => {
    setGridItems(newItems);
    try {
      localStorage.setItem('ayushman_dashboard_widget_order_v3', JSON.stringify(newItems));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleResetGrid = () => {
    setGridItems(DEFAULT_DASHBOARD_WIDGETS);
    localStorage.removeItem('ayushman_dashboard_widget_order_v3');
  };

  // Compute real Semester V academic metrics
  const sem5Stats = useMemo(() => {
    const sem5 = semesters.find(s => s.semesterNumber === 5);
    if (!sem5 || !Array.isArray(sem5.subjects)) {
      return {
        theoryCount: 6,
        labCount: 4,
        totalUnits: 33,
        completedUnits: 11,
        inProgressUnits: 5,
        revisionUnits: 2,
        percent: 33,
        subjects: [] as any[],
      };
    }
    const subjects = sem5.subjects;
    const theoryCount = subjects.filter((s: any) => s.type !== 'lab' && !s.isLab).length;
    const labCount = subjects.filter((s: any) => s.type === 'lab' || s.isLab).length;
    let totalUnits = 0;
    let completedUnits = 0;
    let inProgressUnits = 0;
    let revisionUnits = 0;
    subjects.forEach((sub: any) => {
      const unitList = sub.units || sub.syllabus || [];
      unitList.forEach((u: any) => {
        totalUnits++;
        if (u.completed || u.status === 'completed') completedUnits++;
        else if (u.status === 'in_progress') inProgressUnits++;
        if (u.needsRevision || u.status === 'needs_revision') revisionUnits++;
      });
    });
    const percent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
    return { theoryCount, labCount, totalUnits, completedUnits, inProgressUnits, revisionUnits, percent, subjects };
  }, [semesters]);

  const peakStreak = useMemo(() => {
    if (!habits.length) return 26;
    return Math.max(26, ...habits.map(h => Number(h.streak) || 0));
  }, [habits]);

  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;

  // Render widget for Draggable mode
  const renderWidgetItem = (item: DashboardWidgetItem, _size: WidgetSize) => {
    switch (item.type) {
      case 'academics':
        return (
          <div className="flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-purple-400" />
                <span className="text-sm font-bold text-white">Semester V · RTU CSE</span>
              </div>
              <Link to="/academics" className="text-xs font-mono text-purple-300 hover:text-white flex items-center gap-1">
                <span>Open Hub</span>
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <div className="my-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">{sem5Stats.theoryCount} Theory · {sem5Stats.labCount} Practicals</span>
                <span className="font-mono text-cyan-300 font-bold">{sem5Stats.completedUnits}/{sem5Stats.totalUnits} Units ({sem5Stats.percent}%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" style={{ width: `${sem5Stats.percent}%` }} />
              </div>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between border-t border-white/5 pt-2">
              <span>CGPA: 8.46 (Sem I–IV)</span>
              <span className="text-emerald-400">Zero Backlogs</span>
            </div>
          </div>
        );
      case 'habits':
        return (
          <div className="flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="size-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Discipline Streaks</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-300">
                Peak {peakStreak}d
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 my-2">
              {habits.slice(0, 4).map(h => (
                <div key={h.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-white truncate">{h.title}</div>
                    <div className="text-[10px] font-mono text-amber-300">{h.streak}d</div>
                  </div>
                  <button onClick={() => handleToggleHabit(h.id)} className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold cursor-pointer">+1</button>
                </div>
              ))}
            </div>
            <Link to="/productivity" className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center justify-between border-t border-white/5 pt-2">
              <span>{habits.length} Active Routines</span>
              <span>Journal →</span>
            </Link>
          </div>
        );
      case 'gaming':
        return (
          <div className="flex flex-col justify-between h-full p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gamepad2 className="size-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">Gaming Profiles</span>
              </div>
              <Link to="/gaming" className="text-xs font-mono text-emerald-400 hover:underline">7 Cards →</Link>
            </div>
            <div className="grid grid-cols-2 gap-2 my-2">
              {gaming.slice(0, 2).map((g) => (
                <div key={g.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-xs font-bold text-white truncate">{g.gameName}</div>
                  <div className="text-[10px] font-mono text-cyan-300 truncate">{g.inGameId}</div>
                  <div className="text-[10px] font-mono text-neutral-400 mt-1 truncate">{g.currentRank}</div>
                </div>
              ))}
            </div>
            <div className="text-[11px] font-mono text-neutral-400 border-t border-white/5 pt-2 flex justify-between">
              <span>CR 10,200 · BGMI 5.63 KD</span>
              <span className="text-emerald-400">Chess 2100</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col justify-between h-full p-5">
            <div className="text-sm font-bold text-white">{item.label}</div>
            <p className="text-xs text-neutral-400">Switch to Command Center view for full interactive telemetry.</p>
            <button onClick={() => setLayoutMode('bento')} className="text-xs font-mono text-cyan-400 text-left cursor-pointer">
              Switch to Command Center →
            </button>
          </div>
        );
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 pb-8">
        
        {/* Top Interactive ASCII Hero with Real-time Clock & Theme Switcher */}
        <AsciiHero
          greeting={greeting}
          userName="AYushMan"
          currentTime={currentTime}
        />

        {/* High-Density Telemetry Ribbon — 4 Interactive Command Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Academic Standing */}
          <Link to="/academics" className="group block">
            <SpotlightCard
              enableTilt={true}
              maxTilt={5}
              spotlightColor="rgba(168, 85, 247, 0.2)"
              className="p-5 rounded-2xl bg-[#0a0d18]/90 border border-white/10 hover:border-purple-500/40 transition-all h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-purple-400" />
                  <span>RTU B.Tech CSE</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  Sem V Active
                </span>
              </div>
              <div className="my-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-black text-white tracking-tight">8.46</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Cumulative GPA · Sem I–IV</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-cyan-300">{sem5Stats.percent}%</div>
                  <div className="text-[10px] text-neutral-500">Sem V Syllabus</div>
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(12, sem5Stats.percent)}%` }}
                />
              </div>
            </SpotlightCard>
          </Link>

          {/* Metric 2: Daily Focus & Study Telemetry */}
          <Link to="/productivity" className="group block">
            <SpotlightCard
              enableTilt={true}
              maxTilt={5}
              spotlightColor="rgba(6, 182, 212, 0.2)"
              className="p-5 rounded-2xl bg-[#0a0d18]/90 border border-white/10 hover:border-cyan-500/40 transition-all h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-cyan-400" />
                  <span>Daily Check-In</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {checkin?.mood || 'Focused'}
                </span>
              </div>
              <div className="my-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-black text-white tracking-tight">
                    {checkin?.studyHours || 7.0} <span className="text-sm font-normal text-neutral-400">hrs</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {checkin?.questionsSolved || 9} DSA / Code problems solved
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full w-[85%]" />
              </div>
            </SpotlightCard>
          </Link>

          {/* Metric 3: Discipline Peak Streak */}
          <Link to="/productivity" className="group block">
            <SpotlightCard
              enableTilt={true}
              maxTilt={5}
              spotlightColor="rgba(245, 158, 11, 0.2)"
              className="p-5 rounded-2xl bg-[#0a0d18]/90 border border-white/10 hover:border-amber-500/40 transition-all h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Flame className="size-3.5 text-amber-400" />
                  <span>Discipline Engine</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Peak Streak
                </span>
              </div>
              <div className="my-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-black text-white tracking-tight">{peakStreak} Days</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">{habits.length || 5} daily habit loops tracked</div>
                </div>
                <div className="text-xs font-mono text-amber-300 font-bold">+1 Ready</div>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full w-[88%]" />
              </div>
            </SpotlightCard>
          </Link>

          {/* Metric 4: Sprint Tasks Completion */}
          <Link to="/productivity" className="group block">
            <SpotlightCard
              enableTilt={true}
              maxTilt={5}
              spotlightColor="rgba(16, 185, 129, 0.2)"
              className="p-5 rounded-2xl bg-[#0a0d18]/90 border border-white/10 hover:border-emerald-500/40 transition-all h-full flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>Active Sprint</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Kanban Live
                </span>
              </div>
              <div className="my-3 flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-black text-white tracking-tight">
                    {completedTasksCount} / {tasks.length || 5}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Tasks completed in queue</div>
                </div>
                <ArrowUpRight className="size-4 text-neutral-500 group-hover:text-emerald-400 transition-transform" />
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${tasks.length ? (completedTasksCount / tasks.length) * 100 : 60}%` }}
                />
              </div>
            </SpotlightCard>
          </Link>
        </div>

        {/* Mode Toggle Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Sparkles className="size-3.5 text-cyan-400" />
            <span>Personal Command Center · Zero-Wasted-Space Telemetry</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLayoutMode(layoutMode === 'bento' ? 'draggable' : 'bento')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              {layoutMode === 'bento' ? (
                <>
                  <Move className="size-3.5 text-purple-400" />
                  <span>Switch to Reorderable Grid</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="size-3.5 text-cyan-400" />
                  <span>Switch to Command Bento</span>
                </>
              )}
            </button>
            {layoutMode === 'draggable' && (
              <button
                type="button"
                onClick={handleResetGrid}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-mono transition cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {layoutMode === 'draggable' ? (
          <div className="w-full">
            <DraggableWidgetGrid<DashboardWidgetItem>
              items={gridItems}
              onChange={handleGridChange}
              renderItem={renderWidgetItem}
              maxColumns={4}
              cellSize={220}
              gap={14}
              radius={20}
            />
          </div>
        ) : (
          /* ASYMMETRIC COMMAND CENTER BENTO LAYOUT */
          <div className="space-y-6">
            
            {/* ROW 1: Academics Command Summary (7 cols) + Discipline Streaks & Sprint Tasks (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Panel 1: Academics Command Summary (7 Cols) */}
              <SpotlightCard
                enableTilt={true}
                maxTilt={3}
                spotlightColor="rgba(168, 85, 247, 0.16)"
                className="lg:col-span-7 p-6 rounded-3xl bg-[#0a0d18]/90 border border-white/10 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                        <GraduationCap className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base sm:text-lg font-bold text-white">Academic Command · Semester V</h2>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-[10px] font-mono text-purple-300">
                            RTU Kota
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400">
                          Arya College of Engineering & I.T. · {isAdmin ? 'Roll No: 24EARCS003 · ' : ''}{sem5Stats.theoryCount} Theory + {sem5Stats.labCount} Labs
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/academics"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-xs font-semibold transition"
                    >
                      <span>Open Academics</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>

                  {/* Overall Syllabus Progress Bar */}
                  <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                      <span className="font-semibold text-neutral-200 flex items-center gap-2">
                        <Layers className="size-3.5 text-cyan-400" />
                        <span>Semester V Syllabus Unit Completion</span>
                      </span>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-emerald-400">{sem5Stats.completedUnits} Completed</span>
                        {sem5Stats.inProgressUnits > 0 && (
                          <span className="text-cyan-400">{sem5Stats.inProgressUnits} In Progress</span>
                        )}
                        {sem5Stats.revisionUnits > 0 && (
                          <span className="text-amber-400">{sem5Stats.revisionUnits} Revision</span>
                        )}
                        <span className="text-white font-bold">{sem5Stats.percent}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(6, sem5Stats.percent)}%` }}
                      />
                    </div>
                  </div>

                  {/* 6 Theory Subjects Mini Progress Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {(sem5Stats.subjects.filter((s: any) => s.type !== 'lab' && !s.isLab).slice(0, 6)).map((sub: any) => {
                      const unitList = sub.units || sub.syllabus || [];
                      const total = unitList.length || 5;
                      const done = unitList.filter((u: any) => u.completed || u.status === 'completed').length;
                      const pct = Math.round((done / total) * 100);
                      return (
                        <Link
                          key={sub.code}
                          to={`/academics?sem=5&subject=${encodeURIComponent(sub.code)}`}
                          className="group p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.07] hover:border-purple-400/40 transition flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-mono font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                                {sub.code}
                              </span>
                              <span className="text-[10px] font-mono text-neutral-400">{sub.credits} Cr</span>
                            </div>
                            <div className="text-xs font-bold text-white mt-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                              {sub.title || sub.name}
                            </div>
                          </div>

                          <div className="mt-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                              <span>{done}/{total} Units</span>
                              <span className="text-cyan-300">{pct}%</span>
                            </div>
                            <div className="flex gap-1">
                              {Array.from({ length: total }).map((_, idx) => {
                                const unit = unitList[idx];
                                const isDone = unit?.completed || unit?.status === 'completed';
                                const isRev = unit?.needsRevision || unit?.status === 'needs_revision';
                                const isProg = unit?.status === 'in_progress';
                                return (
                                  <span
                                    key={idx}
                                    className={`h-1.5 flex-1 rounded-full ${
                                      isDone
                                        ? 'bg-emerald-400'
                                        : isRev
                                        ? 'bg-amber-400'
                                        : isProg
                                        ? 'bg-cyan-400'
                                        : 'bg-white/10'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Academic Status Bar */}
                <div className="mt-4 pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span>Sem I: <strong className="text-white">8.38</strong></span>
                    <span>Sem II: <strong className="text-white">8.18</strong></span>
                    <span>Sem III: <strong className="text-white">8.55</strong></span>
                    <span>Sem IV: <strong className="text-white">8.72</strong></span>
                  </div>
                  <Link to="/academics" className="text-[11px] font-mono text-cyan-400 hover:underline">
                    View All 8 Semesters & Marksheets →
                  </Link>
                </div>
              </SpotlightCard>

              {/* Panel 2: Discipline Streaks & Sprint Tasks (5 Cols — Zero Empty Space!) */}
              <SpotlightCard
                enableTilt={true}
                maxTilt={3}
                spotlightColor="rgba(245, 158, 11, 0.16)"
                className="lg:col-span-5 p-6 rounded-3xl bg-[#0a0d18]/90 border border-white/10 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-5">
                  {/* Discipline Streaks Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Flame className="size-4.5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">Discipline Streaks</h2>
                        <p className="text-[11px] text-neutral-400">Daily habits & active sprint tasks</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1">
                        <Flame className="size-3 text-amber-400" />
                        <span>Peak: {peakStreak}d</span>
                      </span>
                    </div>
                  </div>

                  {/* Interactive Habit Bars */}
                  <div className="space-y-2.5">
                    {habits.length > 0 ? (
                      habits.slice(0, 3).map((habit) => {
                        const pct = Math.min(100, Math.round(((Number(habit.streak) || 1) / 30) * 100));
                        const isPulsing = pulsingHabitId === habit.id;
                        return (
                          <div
                            key={habit.id}
                            className={`p-3 rounded-2xl bg-white/[0.025] border transition-all ${
                              isPulsing ? 'border-amber-400 bg-amber-500/10 scale-[1.01]' : 'border-white/[0.07] hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white truncate">{habit.title}</span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                                    {habit.category}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <div className="w-28 sm:w-36 h-1.5 bg-black/50 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-300"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="text-[11px] font-mono text-amber-300 font-semibold">
                                    {habit.streak} Days
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleHabit(habit.id)}
                                className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 hover:text-black border border-amber-500/30 text-amber-300 text-xs font-bold font-mono transition cursor-pointer shrink-0"
                              >
                                +1 Day
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.07] text-center space-y-1.5">
                        <div className="text-xs font-semibold text-neutral-300">
                          {isAdmin ? 'No Active Habits Configured' : 'Discipline Routines Protected'}
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          {isAdmin ? 'Log routines in your productivity journal.' : 'Administrator streaks are confidential. Log in to track.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Active Sprint Tasks Checklist */}
                  <div className="pt-2 border-t border-white/[0.07]">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                        <ListTodo className="size-3.5 text-cyan-400" />
                        <span>Today's Sprint Queue</span>
                      </span>
                      <Link to="/productivity" className="text-[11px] font-mono text-cyan-400 hover:underline">
                        Open Journal →
                      </Link>
                    </div>
                    <div className="space-y-1.5">
                      {tasks.length > 0 ? (
                        tasks.slice(0, 3).map((task) => {
                          const isDone = task.status === 'completed';
                          return (
                            <div
                              key={task.id}
                              onClick={() => handleToggleTask(task.id, task.status)}
                              className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between cursor-pointer transition text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <div
                                  className={`size-4 rounded-md border flex items-center justify-center shrink-0 transition ${
                                    isDone ? 'bg-emerald-500 text-black border-emerald-400' : 'border-white/25'
                                  }`}
                                >
                                  {isDone && <CheckCircle2 className="size-3" />}
                                </div>
                                <span className={`truncate font-medium ${isDone ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                                  {task.title}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded shrink-0">
                                {task.tag}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                          <div className="text-xs font-semibold text-neutral-300">
                            {isAdmin ? 'Sprint Queue Clear' : 'Active Sprint Queue Protected'}
                          </div>
                          <p className="text-[10px] text-neutral-400">
                            {isAdmin ? 'All sprint tasks completed.' : 'Administrator kanban tasks are private.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>{completedTasksCount}/{tasks.length} sprint items done</span>
                  <Link to="/productivity" className="text-amber-300 hover:underline">
                    Log Daily Check-In →
                  </Link>
                </div>
              </SpotlightCard>
            </div>

            {/* ROW 2: Gaming Collector Preview (6 cols) + Watchlist Poster Strip (6 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Panel 3: Gaming Collector Preview (6 Cols) */}
              <SpotlightCard
                enableTilt={true}
                maxTilt={3}
                spotlightColor="rgba(16, 185, 129, 0.16)"
                className="lg:col-span-6 p-6 rounded-3xl bg-[#0a0d18]/90 border border-white/10 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Gamepad2 className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-white">Gaming Collector Roster</h2>
                        <p className="text-xs text-neutral-400">7 verified accounts · Hover cards for holographic sheen</p>
                      </div>
                    </div>
                    <Link
                      to="/gaming"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
                    >
                      <span>All 7 Cards</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>

                  {/* Top 3 Collector Mini-Holo Cards (Clash Royale, BGMI, Chess.com) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    {gaming.slice(0, 3).map((game: any) => (
                      <Link key={game.id} to="/gaming" className="block group">
                        <HoloCard
                          maxTilt={6}
                          holoColor={game.holoColor || 'rgba(6, 182, 212, 0.3)'}
                          accentColor={game.accentColor || '#06b6d4'}
                          className="h-full flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative h-24 w-full overflow-hidden border-b border-white/10">
                              <SmartImage
                                src={game.artworkUrl}
                                alt={game.gameName}
                                category="gaming"
                                accentColor={game.accentColor}
                                containerClassName="size-full"
                                className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e18] via-transparent to-transparent" />
                              <span className="absolute bottom-1.5 left-2.5 text-[10px] font-mono font-bold text-white drop-shadow">
                                {game.gameName}
                              </span>
                            </div>
                            <div className="p-3 space-y-1">
                              <div className="text-xs font-bold text-white break-words">{game.inGameId}</div>
                              {isAdmin && game.uid && (
                                <div className="text-[10px] font-mono text-amber-300">UID: {game.uid}</div>
                              )}
                              <div className="text-[10px] font-mono text-cyan-300 pt-0.5">{game.currentRank}</div>
                            </div>
                          </div>
                        </HoloCard>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Remaining 4 Games Compact Pill Bar */}
                <div className="mt-4 pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-400">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-neutral-300">CoC · TH 18 Maxed</span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-neutral-300">DMC 5 · SSS Rank</span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-neutral-300">Genshin · AR 60</span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-neutral-300">WuWa · UL 80</span>
                  </div>
                </div>
              </SpotlightCard>

              {/* Panel 4: Anime & Movies Poster Strip (6 Cols) */}
              <SpotlightCard
                enableTilt={true}
                maxTilt={3}
                spotlightColor="rgba(244, 63, 94, 0.16)"
                className="lg:col-span-6 p-6 rounded-3xl bg-[#0a0d18]/90 border border-white/10 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <Film className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-white">Anime & Media Watchlist</h2>
                        <p className="text-xs text-neutral-400">
                          {anime.length || 24} titles synced · Big Three + Completed Archive
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/entertainment"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
                    >
                      <span>Anime Vault</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>

                  {/* Poster-Backed Media Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {(anime.length > 0 ? anime.slice(0, 4) : []).map((item: any) => {
                      const pct = item.totalEpisodes
                        ? Math.min(100, Math.round(((item.episodesWatched || item.totalEpisodes) / item.totalEpisodes) * 100))
                        : 100;
                      return (
                        <Link
                          key={item.id}
                          to="/entertainment"
                          className="group relative flex items-center gap-3.5 p-2.5 rounded-2xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.07] hover:border-rose-500/40 transition overflow-hidden"
                        >
                          <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
                            <SmartImage
                              src={item.imageUrl}
                              alt={item.title}
                              category="anime"
                              accentColor="#f43f5e"
                              containerClassName="size-full"
                              className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/20">
                                {item.tier || item.status}
                              </span>
                              {item.score > 0 && (
                                <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-0.5">
                                  <Star className="size-3 fill-amber-400" />
                                  {item.score}
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-bold text-white truncate group-hover:text-rose-200 transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[11px] font-mono text-neutral-400">
                              {item.episodesWatched}/{item.totalEpisodes || '?'} EPS
                            </div>
                            <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>One Piece · Naruto · Bleach · AOT · Solo Leveling</span>
                  <Link to="/entertainment" className="text-rose-400 hover:underline">
                    + Add to Watchlist →
                  </Link>
                </div>
              </SpotlightCard>
            </div>

            {/* ROW 3: Featured Projects Build Tiles (7 cols) + Verified Milestones & Social Hub (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Panel 5: Featured Projects Build Tiles (7 Cols) */}
              <SpotlightCard
                enableTilt={true}
                maxTilt={3}
                spotlightColor="rgba(99, 102, 241, 0.16)"
                className="lg:col-span-7 p-6 rounded-3xl bg-[#0a0d18]/90 border border-white/10 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Code2 className="size-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-white">Featured Engineering Builds</h2>
                        <p className="text-xs text-neutral-400">Production repositories & full-stack architectures</p>
                      </div>
                    </div>
                    <Link
                      to="/developer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition"
                    >
                      <span>Projects & Drum</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    {(projects.length > 0 ? projects.slice(0, 3) : [
                      {
                        id: 1,
                        title: 'AYushMan',
                        tag: 'Full-Stack System',
                        description: 'Interactive personal website & B.Tech academic command center.',
                        technologies: ['React', 'TypeScript', 'Node.js'],
                        githubUrl: 'https://github.com/Aayushman-debug/ayushman-os',
                        imageUrl: '/assets/projects/ayushman-os.svg',
                      },
                      {
                        id: 2,
                        title: 'Mithila Art',
                        tag: 'Web Platform',
                        description: 'Cultural showcase & e-commerce platform for traditional Madhubani art.',
                        technologies: ['React', 'Tailwind', 'Express'],
                        githubUrl: 'https://github.com/Aayushman-debug/mithila-art',
                        imageUrl: '/assets/projects/mithila-art.svg',
                      },
                      {
                        id: 3,
                        title: 'CampusConnect',
                        tag: 'Academic Tool',
                        description: 'Student resource portal for syllabus tracking, PYQs & notes.',
                        technologies: ['TypeScript', 'REST API', 'SQL'],
                        githubUrl: 'https://github.com/Aayushman-debug/campus-connect',
                        imageUrl: '/assets/projects/campus-connect.svg',
                      },
                    ]).map((proj: any) => (
                      <a
                        key={proj.id}
                        href={proj.githubUrl || '/developer'}
                        target={proj.githubUrl?.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="group rounded-2xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.08] hover:border-indigo-400/50 transition-all overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-28 w-full overflow-hidden border-b border-white/10 bg-[#060913]">
                            <SmartImage
                              src={proj.imageUrl}
                              alt={proj.title}
                              category="project"
                              accentColor="#6366f1"
                              containerClassName="size-full"
                              className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/15 text-[9px] font-mono text-indigo-300">
                              {proj.tag}
                            </span>
                          </div>
                          <div className="p-3.5">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {proj.title}
                              </h3>
                              <ArrowUpRight className="size-3.5 text-neutral-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                            <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                              {proj.description}
                            </p>
                          </div>
                        </div>

                        <div className="px-3.5 pb-3 flex flex-wrap gap-1">
                          {(proj.technologies || []).slice(0, 3).map((t: string) => (
                            <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5">
                              {t}
                            </span>
                          ))}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>GitHub: @Aayushman-debug</span>
                  <Link to="/developer" className="text-indigo-400 hover:underline">
                    Explore 3D WorksWheel →
                  </Link>
                </div>
              </SpotlightCard>

              {/* Panel 6: Verified Milestones Archive + Canonical Social Links (5 Cols) */}
              <SpotlightCard
                enableTilt={true}
                maxTilt={3}
                spotlightColor="rgba(6, 182, 212, 0.16)"
                className="lg:col-span-5 p-6 rounded-3xl bg-[#0a0d18]/90 border border-white/10 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <FileCheck2 className="size-4.5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">Milestones & Verified Archive</h2>
                        <p className="text-[11px] text-neutral-400">Official records & canonical social links</p>
                      </div>
                    </div>
                    <Link to="/vault" className="text-xs font-mono text-cyan-400 hover:underline">
                      Vault →
                    </Link>
                  </div>

                  {/* Verified Archive Entries */}
                  <div className="space-y-2.5">
                    {(vault.length > 0 ? vault.slice(0, 2) : [
                      {
                        id: 1,
                        title: 'RTU B.Tech Semester I–IV Marksheets',
                        category: 'Document',
                        date: '2024–2026',
                        content: 'Official marksheet records issued by Rajasthan Technical University, Kota (CGPA 8.46, Zero Backlogs).',
                      },
                      {
                        id: 2,
                        title: 'Full-Stack AYushMan Architecture',
                        category: 'Milestone',
                        date: '2026',
                        content: 'Custom personal command center integrating RTU academics, 7 game profiles, AniList sync, and Spotify embeds.',
                      },
                    ]).map((rec: any) => (
                      <div
                        key={rec.id}
                        className="p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.07] space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {rec.category || 'Record'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                            <ShieldCheck className="size-3" />
                            <span>Verified Record</span>
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white">{rec.title}</div>
                        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{rec.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick Canonical Social Strip */}
                  <div className="pt-2 border-t border-white/[0.07]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        Canonical Identity Links
                      </span>
                      <Link to="/social" className="text-[11px] font-mono text-pink-400 hover:underline">
                        All Platforms →
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href="https://www.instagram.com/wtfk1yo/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-pink-500/10 border border-white/5 hover:border-pink-500/30 transition text-center"
                      >
                        <div className="text-[10px] font-mono text-pink-400">Instagram</div>
                        <div className="text-[11px] font-bold text-white truncate mt-0.5">@wtfk1yo</div>
                      </a>
                      <Link
                        to="/music"
                        className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition text-center"
                      >
                        <div className="text-[10px] font-mono text-emerald-400">Spotify</div>
                        <div className="text-[11px] font-bold text-white truncate mt-0.5">7 Playlists</div>
                      </Link>
                      <a
                        href="https://music.youtube.com/@wtfk1y0?si=eFI36HSD6D3rh-K4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 transition text-center"
                      >
                        <div className="text-[10px] font-mono text-red-400">YT Music</div>
                        <div className="text-[11px] font-bold text-white truncate mt-0.5">@wtfk1y0</div>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>All records persisted locally</span>
                  <Link to="/academics" className="text-cyan-400 hover:underline">
                    Inspect RTU Transcripts →
                  </Link>
                </div>
              </SpotlightCard>
            </div>

          </div>
        )}

      </div>
    </PageTransition>
  );
};

export default DashboardPage;
