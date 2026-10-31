import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  FileText,
  TrendingUp,
  Sparkles,
  Calendar,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  X,
  Layers,
  CheckSquare,
  Bookmark,
  FlaskConical,
  Cpu,
  Code2,
  Radio,
  Monitor,
  Binary,
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { PageTransition } from '@/components/ui/page-transition';

type UnitStatus = 'not_started' | 'in_progress' | 'completed' | 'needs_revision';

const DEFAULT_CHECKLIST = [
  { id: 'read_syllabus', label: 'Read official RTU syllabus & unit weightage', done: true },
  { id: 'complete_notes', label: 'Complete lecture & textbook notes', done: false },
  { id: 'solve_pyqs', label: 'Solve last 5 years RTU PYQ papers', done: false },
  { id: 'revise_important', label: 'Revise high-priority derivations & theorems', done: false },
  { id: 'practice_code', label: 'Practice numerical / algorithmic problems', done: false },
  { id: 'final_revision', label: 'Final pre-exam rapid revision', done: false },
];

const SUBJECT_ACCENTS: Record<string, { color: string; badge: string; border: string; glow: string }> = {
  '5CS3-01': {
    color: '#38bdf8',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    border: 'hover:border-sky-400/50',
    glow: 'rgba(56, 189, 248, 0.18)',
  },
  '5CS4-02': {
    color: '#a855f7',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    border: 'hover:border-purple-400/50',
    glow: 'rgba(168, 85, 247, 0.18)',
  },
  '5CS4-03': {
    color: '#06b6d4',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    border: 'hover:border-cyan-400/50',
    glow: 'rgba(6, 182, 212, 0.18)',
  },
  '5CS4-04': {
    color: '#f43f5e',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    border: 'hover:border-rose-400/50',
    glow: 'rgba(244, 63, 94, 0.18)',
  },
  '5CS4-05': {
    color: '#10b981',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    border: 'hover:border-emerald-400/50',
    glow: 'rgba(16, 185, 129, 0.18)',
  },
  '5CS5-11': {
    color: '#f59e0b',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    border: 'hover:border-amber-400/50',
    glow: 'rgba(245, 158, 11, 0.18)',
  },
};

function getUnitStatus(u: any): UnitStatus {
  if (u.status === 'completed' || u.completed) return 'completed';
  if (u.status === 'needs_revision' || u.needsRevision) return 'needs_revision';
  if (u.status === 'in_progress') return 'in_progress';
  return 'not_started';
}

export const AcademicsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSem, setSelectedSem] = useState<number>(() => {
    const paramSem = Number(searchParams.get('sem'));
    return paramSem >= 1 && paramSem <= 8 ? paramSem : 5;
  });
  const [semesters, setSemesters] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [examSchedule, setExamSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter & Active Sub-view state
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'theory' | 'lab' | 'revision'>('all');
  const [activeSectionTab, setActiveSectionTab] = useState<'workspace' | 'marksheets' | 'resources' | 'exams'>('workspace');

  // Subject Detail Modal state
  const [activeSubjectCode, setActiveSubjectCode] = useState<string | null>(searchParams.get('subject'));
  const [modalTab, setModalTab] = useState<'syllabus' | 'resources' | 'checklist' | 'overview'>('syllabus');

  // Resource Form State
  const [resSubjectCode, setResSubjectCode] = useState('5CS4-02');
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'pyq' | 'notes' | 'book' | 'syllabus' | 'link'>('pyq');
  const [resYear, setResYear] = useState('2025');
  const [resUrl, setResUrl] = useState('');
  const [resNotes, setResNotes] = useState('');

  // Exam Form State
  const [examSubjectCode, setExamSubjectCode] = useState('5CS4-02');
  const [examSubjectTitle, setExamSubjectTitle] = useState('Compiler Design');
  const [examType, setExamType] = useState<'midterm' | 'endterm' | 'practical' | 'quiz'>('endterm');
  const [examDate, setExamDate] = useState('');
  const [examNotes, setExamNotes] = useState('');

  // New Custom Unit Form State in Subject Modal
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitContent, setNewUnitContent] = useState('');
  const [newUnitHours, setNewUnitHours] = useState('6');

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const [overviewRes, semsRes] = await Promise.all([
          fetch('/api/academics/overview').then(r => r.json()),
          fetch('/api/academics/semesters').then(r => r.json())
        ]);
        if (overviewRes.data) setOverview(overviewRes.data);
        if (semsRes.semesters) setSemesters(semsRes.semesters);
        if (semsRes.resources) setResources(semsRes.resources);
        if (semsRes.examSchedule) setExamSchedule(semsRes.examSchedule);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademicData();
  }, []);

  // Ensure all 8 semesters are represented even if backend hasn't reloaded yet
  const allEightSemesters = useMemo(() => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
      const found = semesters.find((s) => Number(s.semesterNumber) === num);
      if (found) return found;
      return {
        id: num,
        semesterNumber: num,
        academicYear: num === 6 ? '2026-2027' : '2027-2028',
        status: num < 5 ? 'completed' : num === 5 ? 'active' : 'upcoming',
        sgpa: null,
        totalCredits: 0,
        remarks: 'Data not yet entered',
        subjects: [],
      };
    });
  }, [semesters]);

  const currentSemData = useMemo(
    () => allEightSemesters.find((s) => Number(s.semesterNumber) === selectedSem),
    [allEightSemesters, selectedSem]
  );

  // Semester 5 aggregate syllabus stats
  const sem5Metrics = useMemo(() => {
    const sem5 = allEightSemesters.find((s) => s.semesterNumber === 5);
    const subs = sem5?.subjects || [];
    const theorySubs = subs.filter((s: any) => s.type !== 'lab');
    const labSubs = subs.filter((s: any) => s.type === 'lab');

    let totalUnits = 0;
    let completedUnits = 0;
    let inProgressUnits = 0;
    let revisionUnits = 0;

    subs.forEach((sub: any) => {
      (sub.units || []).forEach((u: any) => {
        totalUnits++;
        const st = getUnitStatus(u);
        if (st === 'completed') completedUnits++;
        else if (st === 'in_progress') inProgressUnits++;
        if (st === 'needs_revision' || u.needsRevision) revisionUnits++;
      });
    });

    const percent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
    return {
      totalSubjects: subs.length,
      theoryCount: theorySubs.length,
      labCount: labSubs.length,
      totalUnits,
      completedUnits,
      inProgressUnits,
      revisionUnits,
      percent,
    };
  }, [allEightSemesters]);

  const activeSubject = useMemo(() => {
    if (!activeSubjectCode) return null;
    for (const sem of allEightSemesters) {
      const found = (sem.subjects || []).find((s: any) => s.code === activeSubjectCode);
      if (found) return { ...found, semesterNumber: sem.semesterNumber };
    }
    return null;
  }, [allEightSemesters, activeSubjectCode]);

  // Update unit status via backend
  const handleUnitStatusChange = async (
    subjectCode: string,
    unitNumber: number,
    newStatus?: UnitStatus,
    needsRevision?: boolean
  ) => {
    try {
      const res = await fetch('/api/academics/syllabus/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semesterNumber: selectedSem,
          subjectCode,
          unitNumber,
          status: newStatus,
          needsRevision,
        }),
      });
      const data = await res.json();
      if (data.success && data.semesters) {
        setSemesters(data.semesters);
      } else if (data.success) {
        setSemesters((prev) =>
          prev.map((s) => {
            if (s.semesterNumber !== selectedSem) return s;
            return {
              ...s,
              subjects: s.subjects.map((sub: any) => {
                if (sub.code !== subjectCode) return sub;
                return {
                  ...sub,
                  units: (sub.units || []).map((u: any) => {
                    if (Number(u.unit) !== Number(unitNumber)) return u;
                    const updatedCompleted =
                      newStatus !== undefined ? newStatus === 'completed' : !u.completed;
                    return {
                      ...u,
                      completed: updatedCompleted,
                      status: newStatus || (updatedCompleted ? 'completed' : 'not_started'),
                      needsRevision:
                        needsRevision !== undefined
                          ? needsRevision
                          : newStatus === 'needs_revision'
                          ? true
                          : u.needsRevision,
                    };
                  }),
                };
              }),
            };
          })
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle checklist item for a subject
  const handleToggleChecklistItem = async (subject: any, itemId: string) => {
    const currentList = Array.isArray(subject.checklist) && subject.checklist.length > 0
      ? subject.checklist
      : DEFAULT_CHECKLIST;
    const updatedList = currentList.map((item: any) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );

    try {
      const res = await fetch('/api/academics/subject', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semesterNumber: subject.semesterNumber || 5,
          subjectCode: subject.code,
          checklist: updatedList,
        }),
      });
      const data = await res.json();
      if (data.success && data.semesters) {
        setSemesters(data.semesters);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add a custom unit to a subject
  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubject || !newUnitTitle.trim()) return;
    try {
      const res = await fetch('/api/academics/subject', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semesterNumber: activeSubject.semesterNumber || 5,
          subjectCode: activeSubject.code,
          newUnit: {
            title: newUnitTitle.trim(),
            content: newUnitContent.trim() || 'Custom syllabus topic added to tracker.',
            hours: Number(newUnitHours) || 5,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.semesters) {
        setSemesters(data.semesters);
        setNewUnitTitle('');
        setNewUnitContent('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add PYQ / Resource
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;
    try {
      const res = await fetch('/api/academics/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semesterNumber: selectedSem,
          subjectCode: activeSubject ? activeSubject.code : resSubjectCode,
          title: resTitle.trim(),
          type: resType,
          year: Number(resYear) || 2025,
          url: resUrl.trim(),
          notes: resNotes.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.resources) {
        setResources(data.resources);
        setResTitle('');
        setResUrl('');
        setResNotes('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      const res = await fetch(`/api/academics/resources/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.resources) {
        setResources(data.resources);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Exam Schedule entry
  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubjectTitle.trim() || !examDate) return;
    try {
      const res = await fetch('/api/academics/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semesterNumber: selectedSem,
          subjectCode: examSubjectCode,
          subjectTitle: examSubjectTitle.trim(),
          examType,
          examDate,
          notes: examNotes.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.examSchedule) {
        setExamSchedule(data.examSchedule);
        setExamDate('');
        setExamNotes('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExam = async (id: string) => {
    try {
      const res = await fetch(`/api/academics/exams/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.examSchedule) {
        setExamSchedule(data.examSchedule);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = [
    { semester: 'Sem 1', sgpa: 8.42, credits: 21 },
    { semester: 'Sem 2', sgpa: 8.55, credits: 21 },
    { semester: 'Sem 3', sgpa: 8.28, credits: 24 },
    { semester: 'Sem 4', sgpa: 8.60, credits: 24 },
  ];

  // Nearest upcoming exam
  const nearestExam = useMemo(() => {
    if (!examSchedule.length) return null;
    const now = new Date().getTime();
    const upcoming = examSchedule
      .map((ex) => ({
        ...ex,
        diffDays: Math.ceil((new Date(ex.examDate).getTime() - now) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => a.diffDays - b.diffDays);
    return upcoming[0] || null;
  }, [examSchedule]);

  return (
    <PageTransition>
      <div className="space-y-7 pb-10">
        
        {/* 5.A — COMPACT ACADEMIC HERO / HEADER */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-[#0a0d18]/95 border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-2xl">
              <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden ring-2 ring-purple-500/30 shadow-2xl shrink-0 border border-white/20 bg-black/40 group">
                <img
                  src="/assets/profile/ayushman.jpg"
                  alt="Aayushman Pathak"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute bottom-1 right-1 size-3 rounded-full bg-emerald-400 ring-2 ring-[#0a0d18]" title="Verified RTU Candidate" />
              </div>

              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
                    <GraduationCap className="size-3.5" />
                    <span>RTU · Rajasthan Technical University</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
                    <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Semester V · Active</span>
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Academics
                </h1>
                <p className="text-sm text-neutral-300">
                  B.Tech · Computer Science & Engineering — <span className="text-neutral-400">Arya College of Engineering & I.T., Jaipur</span>
                </p>

                {/* Official Student Identifiers Pill Strip */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-mono">
                  <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-neutral-300">
                    Candidate: <strong className="text-white">AAYUSHMAN PATHAK</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-neutral-300">
                    Roll No: <strong className="text-cyan-300">24EARCS003</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-neutral-300">
                    Enrollment: <strong className="text-purple-300">24E1ARCSM40P003</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Summary Telemetry + Quick Jump Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[96px]">
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Cum. CGPA</div>
                  <div className="text-xl font-black text-emerald-400 mt-0.5">8.46</div>
                  <div className="text-[9px] font-mono text-neutral-500">Sem I–IV</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[96px]">
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Sem V Units</div>
                  <div className="text-xl font-black text-cyan-300 mt-0.5">
                    {sem5Metrics.completedUnits}/{sem5Metrics.totalUnits}
                  </div>
                  <div className="text-[9px] font-mono text-neutral-500">{sem5Metrics.percent}% Done</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[96px]">
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Backlogs</div>
                  <div className="text-xl font-black text-white mt-0.5">0</div>
                  <div className="text-[9px] font-mono text-emerald-400">All Clear</div>
                </div>
              </div>

              {/* Quick Section Switchers */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSectionTab('workspace')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeSectionTab === 'workspace'
                      ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                      : 'bg-white/[0.05] hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  <Layers className="size-3.5" />
                  <span>Semester Workspace</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSectionTab('marksheets')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeSectionTab === 'marksheets'
                      ? 'bg-purple-500 text-white font-bold shadow-lg shadow-purple-500/20'
                      : 'bg-white/[0.05] hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  <FileText className="size-3.5" />
                  <span>Results & Marksheets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSectionTab('resources')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeSectionTab === 'resources'
                      ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20'
                      : 'bg-white/[0.05] hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  <BookOpen className="size-3.5" />
                  <span>PYQs & Resources ({resources.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSectionTab('exams')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeSectionTab === 'exams'
                      ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-white/[0.05] hover:bg-white/10 text-neutral-300 border border-white/10'
                  }`}
                >
                  <Calendar className="size-3.5" />
                  <span>Exam Countdown</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5.B — ALL 8 SEMESTERS INTERACTIVE TIMELINE SELECTOR */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#0a0d18]/90 border border-white/10 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
              B.Tech 8-Semester Curriculum Timeline
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              Select any semester to inspect subjects, syllabus, or marksheet
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {allEightSemesters.map((sem) => {
              const num = sem.semesterNumber;
              const isSelected = selectedSem === num;
              const isCompleted = sem.status === 'completed';
              const isActive = sem.status === 'active';

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setSelectedSem(num);
                    setActiveSectionTab('workspace');
                  }}
                  className={`group relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/[0.1] border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                      : isActive
                      ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/15'
                      : isCompleted
                      ? 'bg-white/[0.025] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                      : 'bg-white/[0.01] border-white/5 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-white">Sem {num}</span>
                    {isActive && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-400 text-black">
                        NOW
                      </span>
                    )}
                    {isCompleted && (
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>

                  <div className="mt-2">
                    {isCompleted ? (
                      <>
                        <div className="text-sm font-mono font-bold text-emerald-300">
                          {sem.sgpa} <span className="text-[10px] font-normal text-neutral-400">SGPA</span>
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                          {sem.totalCredits} Credits · PASS
                        </div>
                      </>
                    ) : isActive ? (
                      <>
                        <div className="text-xs font-mono font-bold text-cyan-300">
                          {sem5Metrics.percent}% Syllabus
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                          {sem5Metrics.theoryCount} Th + {sem5Metrics.labCount} Lab
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-[11px] font-mono text-neutral-500">Upcoming</div>
                        <div className="text-[9px] font-mono text-neutral-600 mt-0.5 truncate">
                          {sem.academicYear}
                        </div>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION VIEW ROUTER */}
        {activeSectionTab === 'marksheets' ? (
          /* 5.I — DEDICATED RESULTS & MARKSHEETS VIEW (ALL COMPLETED SEMESTERS + SCHOOL RECORDS) */
          <div className="space-y-6">
            {/* School & University Standing Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0a0d18]/90 border border-white/10">
                <div className="text-[11px] font-mono uppercase text-cyan-400">Class 10 · Secondary</div>
                <div className="text-2xl font-black text-white mt-1">92.40%</div>
                <div className="text-xs text-neutral-400 mt-1">St. Xavier High School · CBSE (2022)</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0a0d18]/90 border border-white/10">
                <div className="text-[11px] font-mono uppercase text-purple-400">Class 12 · Senior Secondary</div>
                <div className="text-2xl font-black text-white mt-1">88.60%</div>
                <div className="text-xs text-neutral-400 mt-1">Senior Secondary Public School · CBSE (2024)</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0a0d18]/90 border border-white/10">
                <div className="text-[11px] font-mono uppercase text-emerald-400">RTU Cumulative CGPA</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">8.46</div>
                <div className="text-xs text-neutral-400 mt-1">90 Earned Credits · Semesters I–IV</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0a0d18]/90 border border-white/10">
                <div className="text-[11px] font-mono uppercase text-amber-400">Academic Standing</div>
                <div className="text-2xl font-black text-white mt-1">First Class</div>
                <div className="text-xs text-emerald-400 font-mono mt-1">Distinction · 0 Backlogs</div>
              </div>
            </div>

            {/* SGPA Trajectory Chart */}
            <div className="p-6 rounded-3xl bg-[#0a0d18]/90 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-white">Verified RTU SGPA Trajectory (Semesters I–IV)</h2>
                  <p className="text-xs text-neutral-400">Official examination grades from Rajasthan Technical University, Kota</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Peak: 8.60 SGPA (Sem IV)
                </span>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="semester" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={[7.5, 9.2]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="sgpa" stroke="#06b6d4" strokeWidth={3} fill="url(#sgpaGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* All 4 Completed Semester Marksheet Tables */}
            <div className="space-y-6">
              {allEightSemesters
                .filter((s) => s.status === 'completed')
                .map((sem) => (
                  <div key={sem.semesterNumber} className="rounded-3xl border border-white/10 bg-[#0a0d18]/90 overflow-hidden">
                    <div className="p-5 bg-white/[0.02] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            B.Tech Semester {sem.semesterNumber} Official Marksheet
                          </h3>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                            {sem.remarks}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Session {sem.academicYear} · Total Credits: {sem.totalCredits}
                        </p>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs text-neutral-400">SGPA: </span>
                        <span className="text-xl font-black text-cyan-300">{sem.sgpa}</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-black/40 border-b border-white/10 font-mono text-neutral-400 uppercase text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Course Code</th>
                            <th className="py-3 px-4">Course Title</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4 text-center">Credits</th>
                            <th className="py-3 px-4 text-center">Midterm (IA)</th>
                            <th className="py-3 px-4 text-center">Endterm (ETE)</th>
                            <th className="py-3 px-4 text-center">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {(sem.subjects || []).map((sub: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/[0.02] transition">
                              <td className="py-3 px-4 font-mono text-purple-300 font-semibold">{sub.code}</td>
                              <td className="py-3 px-4 font-medium text-white">{sub.title}</td>
                              <td className="py-3 px-4 text-neutral-400 uppercase font-mono text-[11px]">{sub.type}</td>
                              <td className="py-3 px-4 text-center font-mono text-neutral-300">{sub.credits}</td>
                              <td className="py-3 px-4 text-center font-mono text-neutral-300">{sub.midterm || '-'}</td>
                              <td className="py-3 px-4 text-center font-mono text-neutral-300">{sub.endterm}</td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                                    String(sub.grade).includes('A')
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      : String(sub.grade).includes('B')
                                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                      : String(sub.grade).includes('C')
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  }`}
                                >
                                  {sub.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : activeSectionTab === 'resources' ? (
          /* 5.G — PREVIOUS-YEAR QUESTIONS (PYQs) & STUDY RESOURCES HUB */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="p-5 rounded-3xl bg-[#0a0d18]/90 border border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">RTU PYQs, Syllabus PDFs & Reference Archive</h2>
                  <p className="text-xs text-neutral-400">
                    Verified study resources, previous-year question papers, and reference textbooks
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  {resources.length} Resources
                </span>
              </div>

              {resources.length === 0 ? (
                <div className="p-8 rounded-3xl bg-[#0a0d18]/80 border border-white/10 text-center space-y-2">
                  <BookOpen className="size-8 text-neutral-500 mx-auto" />
                  <div className="text-sm font-bold text-white">No PYQs or study resources added yet</div>
                  <p className="text-xs text-neutral-400">
                    Use the form on the right to attach RTU PYQ links, textbooks, or lecture notes.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resources.map((res: any) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl bg-[#0a0d18]/90 border border-white/10 hover:border-cyan-500/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                            {res.subjectCode}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono uppercase">
                            {res.type}
                          </span>
                          {res.year && (
                            <span className="text-[11px] font-mono text-neutral-400">Year: {res.year}</span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-white">{res.title}</h3>
                        {res.notes && <p className="text-xs text-neutral-400">{res.notes}</p>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {res.url && (
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition"
                          >
                            <span>Open</span>
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(res.id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 transition cursor-pointer"
                          title="Delete resource"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Resource Form */}
            <div className="lg:col-span-4">
              <form
                onSubmit={handleAddResource}
                className="p-6 rounded-3xl bg-[#0a0d18]/95 border border-white/10 space-y-4 sticky top-24"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <Plus className="size-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Attach PYQ / Study Resource</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-400 mb-1">Subject Code</label>
                    <select
                      value={resSubjectCode}
                      onChange={(e) => setResSubjectCode(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="5CS3-01">5CS3-01 (ITC)</option>
                      <option value="5CS4-02">5CS4-02 (CD)</option>
                      <option value="5CS4-03">5CS4-03 (OS)</option>
                      <option value="5CS4-04">5CS4-04 (CGM)</option>
                      <option value="5CS4-05">5CS4-05 (AoA)</option>
                      <option value="5CS5-11">5CS5-11 (WC)</option>
                      <option value="ALL">All Sem V</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Resource Type</label>
                    <select
                      value={resType}
                      onChange={(e) => setResType(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="pyq">PYQ Paper</option>
                      <option value="notes">Lecture Notes</option>
                      <option value="book">Reference Book</option>
                      <option value="syllabus">Syllabus PDF</option>
                      <option value="link">External Link</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-neutral-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={resTitle}
                    onChange={(e) => setResTitle(e.target.value)}
                    placeholder="e.g. RTU 2024 End-Term Question Paper"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-400 mb-1">Exam Year</label>
                    <input
                      type="number"
                      value={resYear}
                      onChange={(e) => setResYear(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">URL / Link (Optional)</label>
                    <input
                      type="url"
                      value={resUrl}
                      onChange={(e) => setResUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-neutral-400 mb-1">Notes / Important Topics</label>
                  <textarea
                    rows={2}
                    value={resNotes}
                    onChange={(e) => setResNotes(e.target.value)}
                    placeholder="High-weightage units or page numbers..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition cursor-pointer"
                >
                  Save Resource to Archive
                </button>
              </form>
            </div>
          </div>
        ) : activeSectionTab === 'exams' ? (
          /* 5.J — EXAM SCHEDULE & PREPARATION COUNTDOWN */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              <div className="p-5 rounded-3xl bg-[#0a0d18]/90 border border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Examination & Assessment Countdown</h2>
                  <p className="text-xs text-neutral-400">
                    Schedule mid-terms, practical vivas, or RTU end-term dates for live countdown tracking
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  {examSchedule.length ? `${examSchedule.length} Scheduled` : 'No Exam Date Set'}
                </span>
              </div>

              {examSchedule.length === 0 ? (
                <div className="p-8 rounded-3xl bg-[#0a0d18]/80 border border-white/10 text-center space-y-2">
                  <Calendar className="size-8 text-amber-400/70 mx-auto" />
                  <div className="text-sm font-bold text-white">No upcoming exam dates configured</div>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    Add your RTU Mid-Term, Practical Viva, or End-Term examination dates using the scheduler panel to activate live countdown timers.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {examSchedule.map((ex: any) => {
                    const daysLeft = Math.ceil(
                      (new Date(ex.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div
                        key={ex.id}
                        className="p-4 rounded-2xl bg-[#0a0d18]/90 border border-white/10 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono uppercase">
                              {ex.examType}
                            </span>
                            <span className="text-xs font-mono text-purple-300">{ex.subjectCode}</span>
                            <span className="text-xs font-mono text-neutral-400">{ex.examDate}</span>
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1">{ex.subjectTitle}</h3>
                          {ex.notes && <p className="text-xs text-neutral-400 mt-0.5">{ex.notes}</p>}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right font-mono">
                            <div className={`text-lg font-black ${daysLeft >= 0 ? 'text-amber-300' : 'text-neutral-500'}`}>
                              {daysLeft >= 0 ? `${daysLeft}d left` : 'Completed'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteExam(ex.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 transition cursor-pointer"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="lg:col-span-4">
              <form
                onSubmit={handleAddExam}
                className="p-6 rounded-3xl bg-[#0a0d18]/95 border border-white/10 space-y-4"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <Calendar className="size-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Add Exam / Assessment Date</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-400 mb-1">Subject Code</label>
                    <input
                      type="text"
                      value={examSubjectCode}
                      onChange={(e) => setExamSubjectCode(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Exam Type</label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="midterm">Mid-Term (IA)</option>
                      <option value="endterm">RTU End-Term</option>
                      <option value="practical">Practical Viva</option>
                      <option value="quiz">Quiz / Test</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-neutral-400 mb-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={examSubjectTitle}
                    onChange={(e) => setExamSubjectTitle(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="text-xs">
                  <label className="block text-neutral-400 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="text-xs">
                  <label className="block text-neutral-400 mb-1">Target Units / Notes</label>
                  <input
                    type="text"
                    value={examNotes}
                    onChange={(e) => setExamNotes(e.target.value)}
                    placeholder="e.g. Units 1–3 included"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition cursor-pointer"
                >
                  Add to Countdown Schedule
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* MAIN SEMESTER WORKSPACE VIEW (Sem 1–8) */
          <div className="space-y-6">
            
            {/* 5.C — CURRENT SELECTED SEMESTER OVERVIEW PANEL */}
            <div className="p-6 rounded-3xl bg-[#0a0d18]/90 border border-white/10 shadow-xl space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Semester {selectedSem} Overview
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                        currentSemData?.status === 'active'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : currentSemData?.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-white/5 text-neutral-400 border-white/10'
                      }`}
                    >
                      {currentSemData?.status === 'active'
                        ? 'Current Active Semester'
                        : currentSemData?.status === 'completed'
                        ? `Completed · SGPA ${currentSemData?.sgpa}`
                        : 'Upcoming Semester'}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      Session {currentSemData?.academicYear}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    {currentSemData?.remarks}
                  </p>
                </div>

                {/* Filter Pills for Semester 5 */}
                {selectedSem === 5 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: `All (${sem5Metrics.totalSubjects})` },
                      { id: 'theory', label: `Theory (${sem5Metrics.theoryCount})` },
                      { id: 'lab', label: `Labs (${sem5Metrics.labCount})` },
                      { id: 'revision', label: `Needs Revision (${sem5Metrics.revisionUnits})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSubjectFilter(tab.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                          subjectFilter === tab.id
                            ? 'bg-white text-black font-bold'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border border-white/10'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Semester 5 Telemetry Bar */}
              {selectedSem === 5 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07]">
                  <div className="md:col-span-7 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        Overall Semester V Syllabus Progress ({sem5Metrics.completedUnits} of {sem5Metrics.totalUnits} Units Completed)
                      </span>
                      <span className="font-mono font-bold text-cyan-300">{sem5Metrics.percent}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-black/60 overflow-hidden p-0.5 border border-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${Math.max(5, sem5Metrics.percent)}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-emerald-400" />
                        <span>{sem5Metrics.completedUnits} Completed</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-cyan-400" />
                        <span>{sem5Metrics.inProgressUnits} In Progress</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-amber-400" />
                        <span>{sem5Metrics.revisionUnits} Flagged for Revision</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-white/20" />
                        <span>{sem5Metrics.totalUnits - sem5Metrics.completedUnits - sem5Metrics.inProgressUnits} Not Started</span>
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
                    <div className="flex-1">
                      <div className="text-[10px] font-mono uppercase text-neutral-400">Upcoming Exam Status</div>
                      {nearestExam ? (
                        <div className="text-xs font-bold text-amber-300 mt-0.5">
                          {nearestExam.subjectTitle} ({nearestExam.examType}) · {nearestExam.diffDays}d left
                        </div>
                      ) : (
                        <div className="text-xs font-semibold text-neutral-300 mt-0.5">
                          No exam date set · Session 2026–2027
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSectionTab('exams')}
                      className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold transition cursor-pointer shrink-0"
                    >
                      {nearestExam ? 'Manage Dates' : '+ Set Exam Date'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SEMESTER CONTENT BODY */}
            {selectedSem === 5 ? (
              /* 5.D — SEMESTER 5 SUBJECT CARDS & INTERACTIVE SYLLABUS TRACKER */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(currentSemData?.subjects || [])
                    .filter((sub: any) => {
                      if (subjectFilter === 'theory') return sub.type !== 'lab';
                      if (subjectFilter === 'lab') return sub.type === 'lab';
                      if (subjectFilter === 'revision') {
                        return (sub.units || []).some(
                          (u: any) => u.needsRevision || u.status === 'needs_revision'
                        );
                      }
                      return true;
                    })
                    .map((sub: any) => {
                      const units = sub.units || [];
                      const isLab = sub.type === 'lab';
                      const completedCount = units.filter((u: any) => getUnitStatus(u) === 'completed').length;
                      const revisionCount = units.filter(
                        (u: any) => getUnitStatus(u) === 'needs_revision' || u.needsRevision
                      ).length;
                      const pct = units.length > 0 ? Math.round((completedCount / units.length) * 100) : 100;
                      const accent = SUBJECT_ACCENTS[sub.code] || {
                        color: '#06b6d4',
                        badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
                        border: 'hover:border-cyan-400/50',
                        glow: 'rgba(6, 182, 212, 0.16)',
                      };
                      const subResourcesCount = resources.filter(
                        (r) => r.subjectCode === sub.code || r.subjectCode === 'ALL'
                      ).length;

                      return (
                        <SpotlightCard
                          key={sub.code}
                          enableTilt={true}
                          maxTilt={4}
                          spotlightColor={accent.glow}
                          className={`p-6 rounded-3xl bg-[#0a0d18]/90 border border-white/10 ${accent.border} transition-all flex flex-col justify-between shadow-xl group`}
                        >
                          <div>
                            {/* Top Code & Category Row */}
                            <div className="flex items-center justify-between gap-2">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${accent.badge}`}>
                                {sub.code}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {revisionCount > 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                                    {revisionCount} Revise
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono uppercase text-neutral-300">
                                  {sub.type === 'elective' ? 'Elective' : isLab ? 'Practical Lab' : 'Core Theory'}
                                </span>
                              </div>
                            </div>

                            {/* Subject Name & Credits */}
                            <h3 className="text-lg font-bold text-white mt-3 group-hover:text-cyan-200 transition-colors">
                              {sub.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mt-1">
                              <span>{sub.credits} Credits</span>
                              <span>·</span>
                              <span>IA: {sub.maxInternal} / ETE: {sub.maxEndterm}</span>
                              {subResourcesCount > 0 && (
                                <>
                                  <span>·</span>
                                  <span className="text-emerald-400">{subResourcesCount} Docs</span>
                                </>
                              )}
                            </div>

                            {/* Unit Progress Bar & Interactive Unit Pills */}
                            {!isLab && units.length > 0 ? (
                              <div className="mt-5 space-y-3">
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className="text-neutral-300">
                                    {completedCount} / {units.length} Units Completed
                                  </span>
                                  <span className="font-bold" style={{ color: accent.color }}>
                                    {pct}%
                                  </span>
                                </div>

                                <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${Math.max(6, pct)}%`,
                                      backgroundColor: accent.color,
                                    }}
                                  />
                                </div>

                                {/* Unit Pills Row (Click to toggle directly) */}
                                <div className="grid grid-cols-6 gap-1.5 pt-1">
                                  {units.map((u: any) => {
                                    const st = getUnitStatus(u);
                                    return (
                                      <button
                                        key={u.unit}
                                        type="button"
                                        onClick={() => handleUnitStatusChange(sub.code, u.unit)}
                                        title={`Unit ${u.unit}: ${u.title} (${st.replace('_', ' ')}) — Click to toggle`}
                                        className={`py-1.5 rounded-lg text-[10px] font-mono font-bold border transition cursor-pointer ${
                                          st === 'completed'
                                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                            : st === 'needs_revision'
                                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                            : st === 'in_progress'
                                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                                            : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                                        }`}
                                      >
                                        U{u.unit}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Preview of Next Pending Unit */}
                                {(() => {
                                  const nextUnit = units.find((u: any) => getUnitStatus(u) !== 'completed') || units[0];
                                  return nextUnit ? (
                                    <div className="p-3 rounded-2xl bg-white/[0.025] border border-white/[0.06] text-xs space-y-1">
                                      <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400">
                                        <span>Active Focus · Unit {nextUnit.unit}</span>
                                        <span>{nextUnit.hours} hrs</span>
                                      </div>
                                      <div className="font-semibold text-neutral-200 truncate">
                                        {nextUnit.title}
                                      </div>
                                      <p className="text-[11px] text-neutral-400 line-clamp-1">
                                        {nextUnit.content}
                                      </p>
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            ) : (
                              <div className="mt-5 p-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.06] text-xs space-y-1">
                                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                                  <FlaskConical className="size-3.5" />
                                  <span>Practical Laboratory Record & Viva</span>
                                </div>
                                <p className="text-[11px] text-neutral-400">
                                  Internal sessional practicals (30 marks) + RTU External Viva & Lab exam (20 marks).
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Card Footer Actions */}
                          <div className="mt-5 pt-3.5 border-t border-white/[0.07] flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSubjectCode(sub.code);
                                setModalTab('syllabus');
                              }}
                              className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>Open Subject</span>
                              <ArrowUpRight className="size-3.5 text-cyan-400" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSubjectCode(sub.code);
                                setModalTab('resources');
                              }}
                              className="py-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer"
                              title="Subject PYQs & Resources"
                            >
                              PYQs
                            </button>
                          </div>
                        </SpotlightCard>
                      );
                    })}
                </div>
              </div>
            ) : currentSemData?.status === 'completed' ? (
              /* COMPLETED SEMESTERS (Sem 1–4): SUBJECT CARDS + OFFICIAL MARKSHEET TABLE */
              <div className="space-y-6">
                <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0a0d18]/90">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-white/5 border-b border-white/10 font-mono text-neutral-400 uppercase text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">Course Code</th>
                        <th className="py-3.5 px-4">Course Title</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4 text-center">Credits</th>
                        <th className="py-3.5 px-4 text-center">Midterm (IA)</th>
                        <th className="py-3.5 px-4 text-center">Endterm (ETE)</th>
                        <th className="py-3.5 px-4 text-center">RTU Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(currentSemData.subjects || []).map((sub: any, idx: number) => (
                        <tr key={idx} className="hover:bg-white/[0.025] transition">
                          <td className="py-3.5 px-4 font-mono text-purple-300 font-semibold">{sub.code}</td>
                          <td className="py-3.5 px-4 font-medium text-white">{sub.title}</td>
                          <td className="py-3.5 px-4 text-neutral-400 uppercase font-mono text-xs">{sub.type}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-neutral-300">{sub.credits}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-neutral-300">{sub.midterm || '-'}</td>
                          <td className="py-3.5 px-4 text-center font-mono text-neutral-300">{sub.endterm}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                                String(sub.grade).includes('A')
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : String(sub.grade).includes('B')
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : String(sub.grade).includes('C')
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {sub.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* UPCOMING SEMESTERS (Sem 6, 7, 8) — HONEST EMPTY STATE */
              <div className="p-10 rounded-3xl bg-[#0a0d18]/90 border border-white/10 text-center space-y-4">
                <div className="size-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto">
                  <GraduationCap className="size-6" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-white">
                    Semester {selectedSem} — Upcoming Curriculum ({currentSemData?.academicYear})
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Data not yet entered. Semester {selectedSem} subjects, credits, and RTU syllabus units will be activated upon completion of Semester V.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSem(5)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs transition cursor-pointer"
                >
                  Return to Active Semester V Workspace
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5.E — SUBJECT DETAIL MODAL / DRAWER */}
        {activeSubject && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-4xl rounded-3xl bg-[#0b0e18] border border-white/15 shadow-[0_25px_90px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-white/[0.02] border-b border-white/10 flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                      {activeSubject.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono uppercase">
                      Semester {activeSubject.semesterNumber || 5} · {activeSubject.type}
                    </span>
                    <span className="text-xs font-mono text-cyan-300">
                      {activeSubject.credits} Credits · Max Marks: {(activeSubject.maxInternal || 30) + (activeSubject.maxEndterm || 120)}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                    {activeSubject.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSubjectCode(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Sub-Navigation Tabs */}
              <div className="px-6 pt-3 bg-black/40 border-b border-white/10 flex flex-wrap gap-2">
                {[
                  { id: 'syllabus', label: `Syllabus & Units (${(activeSubject.units || []).length})` },
                  { id: 'resources', label: 'PYQs & Study Resources' },
                  { id: 'checklist', label: 'Preparation Checklist' },
                  { id: 'overview', label: 'Assessment & Exam Info' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setModalTab(t.id as any)}
                    className={`px-4 py-2 rounded-t-xl text-xs font-semibold border-b-2 transition cursor-pointer ${
                      modalTab === t.id
                        ? 'border-cyan-400 text-white bg-white/[0.05]'
                        : 'border-transparent text-neutral-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {modalTab === 'syllabus' && (
                  <div className="space-y-4">
                    {(activeSubject.units || []).length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                        <p className="text-sm font-bold text-white">Practical Lab / Custom Coursework</p>
                        <p className="text-xs text-neutral-400">
                          Add lab experiments or syllabus units below to track completion.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(activeSubject.units || []).map((u: any) => {
                          const st = getUnitStatus(u);
                          return (
                            <div
                              key={u.unit}
                              className={`p-4 rounded-2xl border transition ${
                                st === 'completed'
                                  ? 'bg-emerald-950/15 border-emerald-500/30'
                                  : st === 'needs_revision'
                                  ? 'bg-amber-950/15 border-amber-500/30'
                                  : st === 'in_progress'
                                  ? 'bg-cyan-950/15 border-cyan-500/30'
                                  : 'bg-white/[0.02] border-white/10'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs font-bold">
                                      Unit {u.unit}
                                    </span>
                                    <h4 className="text-sm font-bold text-white">{u.title}</h4>
                                    <span className="text-[11px] font-mono text-neutral-400">
                                      ({u.hours} hrs)
                                    </span>
                                  </div>
                                  <p className="text-xs text-neutral-300 leading-relaxed">
                                    {u.content}
                                  </p>
                                </div>

                                {/* 4-State Status Selector Buttons */}
                                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                  {[
                                    { id: 'not_started', label: 'Pending', cls: 'hover:bg-white/10 text-neutral-400' },
                                    { id: 'in_progress', label: 'In Progress', cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
                                    { id: 'completed', label: 'Completed', cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                                    { id: 'needs_revision', label: 'Revise', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                                  ].map((btn) => (
                                    <button
                                      key={btn.id}
                                      type="button"
                                      onClick={() =>
                                        handleUnitStatusChange(activeSubject.code, u.unit, btn.id as UnitStatus)
                                      }
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition cursor-pointer ${
                                        st === btn.id
                                          ? `${btn.cls} ring-1 ring-white/40`
                                          : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                                      }`}
                                    >
                                      {btn.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Custom Unit / Lab Experiment Form */}
                    <form
                      onSubmit={handleAddUnit}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3"
                    >
                      <div className="text-xs font-mono uppercase text-neutral-400">
                        + Add Custom Syllabus Topic or Lab Experiment
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                        <input
                          type="text"
                          value={newUnitTitle}
                          onChange={(e) => setNewUnitTitle(e.target.value)}
                          placeholder="Unit / Experiment Title"
                          className="sm:col-span-2 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                        <input
                          type="text"
                          value={newUnitContent}
                          onChange={(e) => setNewUnitContent(e.target.value)}
                          placeholder="Subtopics covered..."
                          className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                        <button
                          type="submit"
                          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl px-3 py-2 transition cursor-pointer"
                        >
                          Add Unit
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {modalTab === 'resources' && (
                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      {resources
                        .filter((r) => r.subjectCode === activeSubject.code || r.subjectCode === 'ALL')
                        .map((res: any) => (
                          <div
                            key={res.id}
                            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[10px] font-mono uppercase">
                                  {res.type}
                                </span>
                                <span className="text-xs font-mono text-neutral-400">{res.year}</span>
                              </div>
                              <div className="text-sm font-bold text-white mt-1">{res.title}</div>
                              {res.notes && <div className="text-xs text-neutral-400 mt-0.5">{res.notes}</div>}
                            </div>
                            <div className="flex items-center gap-2">
                              {res.url && (
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-semibold"
                                >
                                  Open Link
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteResource(res.id)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 cursor-pointer"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Quick Attach Resource for this Subject */}
                    <form
                      onSubmit={handleAddResource}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-xs"
                    >
                      <div className="font-bold text-white">
                        Attach PYQ / Notes for {activeSubject.code}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <input
                          type="text"
                          required
                          value={resTitle}
                          onChange={(e) => setResTitle(e.target.value)}
                          placeholder="Resource Title (e.g. 2024 RTU Solved Paper)"
                          className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                        <input
                          type="url"
                          value={resUrl}
                          onChange={(e) => setResUrl(e.target.value)}
                          placeholder="URL / Google Drive / PDF Link"
                          className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white"
                        />
                        <button
                          type="submit"
                          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl px-4 py-2 cursor-pointer"
                        >
                          + Attach Resource
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {modalTab === 'checklist' && (
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-400">
                      Track your exam readiness milestones for <strong>{activeSubject.title}</strong>:
                    </p>
                    {(Array.isArray(activeSubject.checklist) && activeSubject.checklist.length > 0
                      ? activeSubject.checklist
                      : DEFAULT_CHECKLIST
                    ).map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleChecklistItem(activeSubject, item.id)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                          item.done
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                            : 'bg-white/[0.02] border-white/10 text-neutral-200 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-5 rounded-md border flex items-center justify-center ${
                              item.done ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/25'
                            }`}
                          >
                            {item.done && <CheckCircle2 className="size-3.5" />}
                          </div>
                          <span className={`text-xs font-semibold ${item.done ? 'line-through opacity-75' : ''}`}>
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase">
                          {item.done ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {modalTab === 'overview' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="text-neutral-400 font-mono uppercase text-[10px]">RTU Assessment Scheme</div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>Internal Assessment (IA / Midterm)</span>
                        <strong className="text-white font-mono">{activeSubject.maxInternal || 30} Marks</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>End-Term Examination (ETE)</span>
                        <strong className="text-white font-mono">{activeSubject.maxEndterm || 120} Marks</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Total Course Credits</span>
                        <strong className="text-cyan-300 font-mono">{activeSubject.credits} Credits</strong>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <div className="text-neutral-400 font-mono uppercase text-[10px]">University Metadata</div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>University</span>
                        <strong className="text-white">RTU Kota</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span>Curriculum</span>
                        <strong className="text-white">B.Tech CSE · Semester V</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Roll No</span>
                        <strong className="text-purple-300 font-mono">24EARCS003</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
};

export default AcademicsPage;
