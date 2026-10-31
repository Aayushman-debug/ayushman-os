import { Router, Request, Response } from 'express';
import { appStore, savePersistedStore } from '../database/persistence';
import { query, isDbConnected } from '../database/db';
import { requireAdmin } from '../middleware/authorization';

const router = Router();

// GET /api/academics/overview
router.get('/overview', requireAdmin, async (_req: Request, res: Response) => {
  const semestersData = appStore.semesters;
  const completedSems = semestersData.filter((s: any) => s.status === 'completed');
  const totalCredits = completedSems.reduce((acc: number, s: any) => acc + (s.totalCredits || 0), 0);
  const avgSgpa =
    completedSems.reduce((acc: number, s: any) => acc + (s.sgpa || 0), 0) /
    (completedSems.length || 1);
  const activeSemester =
    semestersData.find((s: any) => s.status === 'active') ||
    semestersData.find((s: any) => s.semesterNumber === 5);

  return res.json({
    success: true,
    data: {
      university: 'Rajasthan Technical University, Kota',
      college: 'Arya College of Engineering & Information Technology, Jaipur (Kukas)',
      branch: 'Computer Science and Engineering (CSE)',
      rollNo: '24EARCS003',
      enrollmentNo: '24E1ARCSM40P003',
      currentSemester: 5,
      completedSemestersCount: completedSems.length,
      overallCgpa: Number(avgSgpa.toFixed(2)),
      totalEarnedCredits: totalCredits,
      activeSemester,
      resources: appStore.academicResources || [],
      examSchedule: appStore.examSchedule || [],
      schooling: [
        { level: 'Class 10 (Secondary)', institution: 'St. Xavier High School', board: 'CBSE', year: 2022, score: '92.40%' },
        { level: 'Class 12 (Senior Secondary)', institution: 'Senior Secondary Public School', board: 'CBSE', year: 2024, score: '88.60%' },
      ],
    }
  });
});

// GET /api/academics/semesters — Administrator Only
router.get('/semesters', requireAdmin, async (_req: Request, res: Response) => {
  return res.json({
    success: true,
    semesters: appStore.semesters,
    resources: appStore.academicResources || [],
    examSchedule: appStore.examSchedule || []
  });
});

// GET /api/academics/semesters/:id
router.get('/semesters/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  const semester = appStore.semesters.find(
    (s: any) => s.id === id || s.semesterNumber === id
  );
  if (!semester) {
    return res.status(404).json({ success: false, message: 'Semester not found' });
  }
  return res.json({ success: true, semester });
});

// POST /api/academics/syllabus/toggle
// Supports toggling completion or setting status ('not_started' | 'in_progress' | 'completed' | 'needs_revision') and needsRevision flag
router.post('/syllabus/toggle', requireAdmin, async (req: Request, res: Response) => {
  const { semesterNumber = 5, subjectCode, unitNumber, status, needsRevision } = req.body;
  const sem = appStore.semesters.find(
    (s: any) => s.semesterNumber === Number(semesterNumber)
  );
  if (sem) {
    const subject = sem.subjects.find((sub: any) => sub.code === subjectCode);
    if (subject && Array.isArray(subject.units)) {
      const unit = subject.units.find((u: any) => Number(u.unit) === Number(unitNumber));
      if (unit) {
        if (status !== undefined) {
          unit.status = status;
          unit.completed = status === 'completed';
          if (status === 'needs_revision') {
            unit.needsRevision = true;
          }
        } else if (needsRevision !== undefined) {
          unit.needsRevision = Boolean(needsRevision);
        } else {
          unit.completed = !unit.completed;
          unit.status = unit.completed ? 'completed' : 'not_started';
        }

        if (!savePersistedStore(appStore)) {
          return res.status(500).json({ success: false, message: 'Failed to save academic changes.' });
        }

        if (isDbConnected()) {
          try {
            await query(
              `UPDATE syllabus_units SET is_completed = ? WHERE subject_code = ? AND unit_number = ?`,
              [unit.completed ? 1 : 0, subjectCode, unitNumber]
            );
          } catch {
            // Non-blocking fallback
          }
        }

        return res.json({
          success: true,
          message: 'Unit status updated',
          unit,
          subject,
          semesters: appStore.semesters
        });
      }
    }
  }
  return res.status(400).json({ success: false, message: 'Unit not found' });
});

// PATCH /api/academics/subject — Update subject metadata (faculty, notes, checklist, or add syllabus unit)
router.patch('/subject', requireAdmin, async (req: Request, res: Response) => {
  const {
    semesterNumber = 5,
    subjectCode,
    faculty,
    nextAssessment,
    checklist,
    newUnit
  } = req.body;

  const sem = appStore.semesters.find(
    (s: any) => s.semesterNumber === Number(semesterNumber)
  );
  if (!sem) {
    return res.status(404).json({ success: false, message: 'Semester not found' });
  }

  const subject = sem.subjects.find((sub: any) => sub.code === subjectCode);
  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  if (faculty !== undefined) subject.faculty = faculty;
  if (nextAssessment !== undefined) subject.nextAssessment = nextAssessment;
  if (Array.isArray(checklist)) subject.checklist = checklist;
  if (newUnit && newUnit.title) {
    if (!Array.isArray(subject.units)) subject.units = [];
    const nextNum = subject.units.length + 1;
    subject.units.push({
      unit: Number(newUnit.unit) || nextNum,
      title: String(newUnit.title).trim(),
      hours: Number(newUnit.hours) || 4,
      completed: false,
      status: 'not_started',
      needsRevision: false,
      content: String(newUnit.content || '').trim()
    });
  }

  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save academic changes.' });
  }
  return res.json({ success: true, subject, semesters: appStore.semesters });
});

// POST /api/academics/resources — Add PYQ, PDF note, lecture note, or reference link
router.post('/resources', requireAdmin, async (req: Request, res: Response) => {
  const { subjectCode, unitNumber, title, type, url, year } = req.body;
  if (!subjectCode || !title) {
    return res.status(400).json({ success: false, message: 'Subject code and title are required' });
  }

  const newRes = {
    id: Date.now(),
    subjectCode: String(subjectCode),
    unitNumber: unitNumber ? Number(unitNumber) : undefined,
    title: String(title).trim(),
    type: type || 'pyq',
    url: String(url || '').trim(),
    year: year ? String(year) : new Date().getFullYear().toString(),
    addedAt: new Date().toISOString().split('T')[0]
  };

  if (!Array.isArray(appStore.academicResources)) {
    appStore.academicResources = [];
  }
  appStore.academicResources.unshift(newRes);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save academic changes.' });
  }

  return res.json({
    success: true,
    resource: newRes,
    resources: appStore.academicResources
  });
});

// DELETE /api/academics/resources/:id
router.delete('/resources/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  appStore.academicResources = (appStore.academicResources || []).filter(
    (r) => Number(r.id) !== id
  );
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save academic changes.' });
  }
  return res.json({ success: true, resources: appStore.academicResources });
});

// POST /api/academics/exams — Add upcoming examination or deadline
router.post('/exams', requireAdmin, async (req: Request, res: Response) => {
  const { subjectCode, subjectTitle, examType, examDate, examTime, syllabusUnits, notes } = req.body;
  if (!subjectCode || !examDate) {
    return res.status(400).json({ success: false, message: 'Subject and exam date are required' });
  }

  const newExam = {
    id: Date.now(),
    subjectCode: String(subjectCode),
    subjectTitle: String(subjectTitle || subjectCode),
    examType: examType || 'Midterm I',
    examDate: String(examDate),
    examTime: examTime ? String(examTime) : '10:00 AM',
    syllabusUnits: syllabusUnits ? String(syllabusUnits) : 'Units 1–3',
    notes: notes ? String(notes) : ''
  };

  if (!Array.isArray(appStore.examSchedule)) {
    appStore.examSchedule = [];
  }
  appStore.examSchedule.push(newExam);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save academic changes.' });
  }

  return res.json({
    success: true,
    exam: newExam,
    examSchedule: appStore.examSchedule
  });
});

// DELETE /api/academics/exams/:id
router.delete('/exams/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  appStore.examSchedule = (appStore.examSchedule || []).filter((e) => Number(e.id) !== id);
  if (!savePersistedStore(appStore)) {
    return res.status(500).json({ success: false, message: 'Failed to save academic changes.' });
  }
  return res.json({ success: true, examSchedule: appStore.examSchedule });
});

export default router;
