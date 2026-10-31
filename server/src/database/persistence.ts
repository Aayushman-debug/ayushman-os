import fs from 'fs';
import path from 'path';
import {
  initialAnime,
  initialMovies,
  initialMusic,
  initialGaming,
  initialSocialProfiles,
  initialSemesters,
  initialProjects
} from '../data/initialData';
import { ADMIN_EMAIL } from '../middleware/authorization';

const STORE_FILE = process.env.AYUSHMAN_STORE_FILE
  ? path.resolve(process.env.AYUSHMAN_STORE_FILE)
  : path.resolve(__dirname, '../data/persistedStore.json');
export const LEGACY_DEFAULT_ADMIN_PASSWORD_HASH = '$2a$10$LkN2yIZSKHadcMyyfhJ6Cu70roKW3V2baLIej4IjazM/Ab/60uNSm';

export interface AcademicResourceItem {
  id: number;
  subjectCode: string;
  unitNumber?: number;
  title: string;
  type: 'pyq' | 'pdf_notes' | 'lecture_notes' | 'reference_link' | 'personal_material';
  url: string;
  year?: string;
  addedAt: string;
}

export interface AcademicExamItem {
  id: number;
  subjectCode: string;
  subjectTitle: string;
  examType: 'Midterm I' | 'Midterm II' | 'RTU Endterm' | 'Practical / Viva' | 'Assignment';
  examDate: string;
  examTime?: string;
  syllabusUnits?: string;
  notes?: string;
}

export interface UserRecord {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  fatherName?: string;
  collegeName?: string;
  branch?: string;
  university?: string;
  rollNo?: string;
  enrollmentNo?: string;
  avatarUrl?: string;
  bio?: string;
  role: 'admin' | 'visitor';
  emailVerified: boolean;
  googleId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationTokenRecord {
  id: number;
  userId: number;
  email: string;
  tokenHash: string;
  token: string;
  expiresAt: string;
  usedAt?: string | null;
  createdAt: string;
}

export interface PasswordResetRecord {
  id: number;
  userId: number;
  email: string;
  tokenHash: string;
  token: string;
  expiresAt: string;
  usedAt?: string | null;
  createdAt: string;
}

export interface PersistedDataStore {
  version: number;
  users: UserRecord[];
  emailVerifications: VerificationTokenRecord[];
  passwordResets: PasswordResetRecord[];
  anime: any[];
  movies: any[];
  music: any[];
  gaming: any[];
  socialProfiles: any[];
  semesters: any[];
  projects: any[];
  academicResources: AcademicResourceItem[];
  examSchedule: AcademicExamItem[];
  playlistTracksCache: Record<string, any[]>;
}

const CURRENT_STORE_VERSION = 7;

function getDefaultStore(): PersistedDataStore {
  return {
    version: CURRENT_STORE_VERSION,
    users: [],
    emailVerifications: [],
    passwordResets: [],
    anime: JSON.parse(JSON.stringify(initialAnime)),
    movies: JSON.parse(JSON.stringify(initialMovies)),
    music: JSON.parse(JSON.stringify(initialMusic)),
    gaming: JSON.parse(JSON.stringify(initialGaming)),
    socialProfiles: JSON.parse(JSON.stringify(initialSocialProfiles)),
    semesters: JSON.parse(JSON.stringify(initialSemesters)),
    projects: JSON.parse(JSON.stringify(initialProjects)),
    academicResources: [
      {
        id: 101,
        subjectCode: '5CS4-02',
        unitNumber: 2,
        title: 'RTU B.Tech Sem V Compiler Design — Official Syllabus & Unit Reference',
        type: 'reference_link',
        url: 'https://rtu.ac.in',
        year: '2026',
        addedAt: '2026-10-12'
      },
      {
        id: 102,
        subjectCode: '5CS4-05',
        unitNumber: 2,
        title: 'Analysis of Algorithms — DP & Greedy Standard Problem Set',
        type: 'personal_material',
        url: 'https://github.com/Aayushman-debug',
        year: '2026',
        addedAt: '2026-10-12'
      }
    ],
    examSchedule: [],
    playlistTracksCache: {}
  };
}

export function loadPersistedStore(): PersistedDataStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<PersistedDataStore>;
      if (parsed && parsed.version === CURRENT_STORE_VERSION) {
        const users = (Array.isArray(parsed.users) ? parsed.users : []).map((user) => ({
          ...user,
          passwordHash:
            user.email.toLowerCase() === ADMIN_EMAIL && user.passwordHash === LEGACY_DEFAULT_ADMIN_PASSWORD_HASH
              ? ''
              : user.passwordHash,
          role: user.email.toLowerCase() === ADMIN_EMAIL ? 'admin' as const : 'visitor' as const,
        }));
        return {
          ...getDefaultStore(),
          ...parsed,
          users,
        };
      }
      // Upgrade from v6 -> v7 (or earlier): Ensure auth store & users array exist
      if (parsed && (parsed.version === undefined || parsed.version < CURRENT_STORE_VERSION)) {
        const defaults = getDefaultStore();
        const existingUsers = Array.isArray(parsed.users) ? parsed.users : [];
        // Enforce sole admin policy: only ADMIN_EMAIL may have role 'admin'
        const sanitizedUsers: UserRecord[] = existingUsers.map((u: any) => ({
          ...u,
          passwordHash:
            u.email?.toLowerCase() === ADMIN_EMAIL && u.passwordHash === LEGACY_DEFAULT_ADMIN_PASSWORD_HASH
              ? ''
              : u.passwordHash,
          role: (u.email && u.email.toLowerCase() === ADMIN_EMAIL) ? 'admin' : 'visitor',
        }));

        const upgraded: PersistedDataStore = {
          ...defaults,
          version: CURRENT_STORE_VERSION,
          users: sanitizedUsers,
          emailVerifications: Array.isArray(parsed.emailVerifications) ? parsed.emailVerifications : [],
          passwordResets: Array.isArray(parsed.passwordResets) ? parsed.passwordResets : [],
          anime: Array.isArray(parsed.anime) && parsed.anime.length > 0 ? parsed.anime : defaults.anime,
          movies: Array.isArray(parsed.movies) && parsed.movies.length > 0 ? parsed.movies : defaults.movies,
          music: Array.isArray(parsed.music) && parsed.music.length > 0 ? parsed.music : defaults.music,
          gaming: Array.isArray(parsed.gaming) && parsed.gaming.length > 0 ? parsed.gaming : defaults.gaming,
          socialProfiles: Array.isArray(parsed.socialProfiles) && parsed.socialProfiles.length > 0 ? parsed.socialProfiles : defaults.socialProfiles,
          semesters: Array.isArray(parsed.semesters) && parsed.semesters.length > 0 ? parsed.semesters : defaults.semesters,
          projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : defaults.projects,
          academicResources: Array.isArray(parsed.academicResources) && parsed.academicResources.length > 0 ? parsed.academicResources : defaults.academicResources,
          examSchedule: Array.isArray(parsed.examSchedule) ? parsed.examSchedule : defaults.examSchedule,
          playlistTracksCache: parsed.playlistTracksCache || {}
        };
        savePersistedStore(upgraded);
        return upgraded;
      }
    }
  } catch (err) {
    console.warn('[Persistence] Could not read persistedStore.json, initializing fresh:', err);
  }
  const fresh = getDefaultStore();
  savePersistedStore(fresh);
  return fresh;
}

export function savePersistedStore(store: PersistedDataStore): boolean {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Persistence] Failed to write persistedStore.json:', err);
    return false;
  }
}

export const appStore: PersistedDataStore = loadPersistedStore();

export function findUserByEmail(email: string): UserRecord | undefined {
  if (!email) return undefined;
  const normalized = email.trim().toLowerCase();
  return appStore.users.find((u) => u.email.toLowerCase() === normalized);
}

export function findUserById(id: number): UserRecord | undefined {
  return appStore.users.find((u) => u.id === id);
}

export function saveUser(user: UserRecord): boolean {
  const index = appStore.users.findIndex((u) => u.id === user.id);
  user.updatedAt = new Date().toISOString();
  if (index >= 0) {
    appStore.users[index] = user;
  } else {
    appStore.users.push(user);
  }
  return savePersistedStore(appStore);
}

export function createUser(userData: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>): UserRecord {
  const nextId = appStore.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const now = new Date().toISOString();
  const newUser: UserRecord = {
    ...userData,
    id: nextId,
    createdAt: now,
    updatedAt: now,
  };
  appStore.users.push(newUser);
  savePersistedStore(appStore);
  return newUser;
}

export function createVerificationToken(userId: number, email: string, token: string, tokenHash: string, expiresAt: Date): VerificationTokenRecord {
  const nextId = (appStore.emailVerifications || []).reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const record: VerificationTokenRecord = {
    id: nextId,
    userId,
    email: email.trim().toLowerCase(),
    tokenHash,
    token,
    expiresAt: expiresAt.toISOString(),
    usedAt: null,
    createdAt: new Date().toISOString(),
  };
  if (!Array.isArray(appStore.emailVerifications)) {
    appStore.emailVerifications = [];
  }
  appStore.emailVerifications.push(record);
  savePersistedStore(appStore);
  return record;
}

export function findVerificationToken(tokenHash: string): VerificationTokenRecord | undefined {
  if (!Array.isArray(appStore.emailVerifications)) return undefined;
  return appStore.emailVerifications.find((t) => t.tokenHash === tokenHash);
}

export function markVerificationTokenUsed(id: number): boolean {
  if (!Array.isArray(appStore.emailVerifications)) return false;
  const record = appStore.emailVerifications.find((t) => t.id === id);
  if (record) {
    record.usedAt = new Date().toISOString();
    return savePersistedStore(appStore);
  }
  return false;
}

export function createPasswordResetToken(userId: number, email: string, token: string, tokenHash: string, expiresAt: Date): PasswordResetRecord {
  const nextId = (appStore.passwordResets || []).reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const record: PasswordResetRecord = {
    id: nextId,
    userId,
    email: email.trim().toLowerCase(),
    tokenHash,
    token,
    expiresAt: expiresAt.toISOString(),
    usedAt: null,
    createdAt: new Date().toISOString(),
  };
  if (!Array.isArray(appStore.passwordResets)) {
    appStore.passwordResets = [];
  }
  appStore.passwordResets.push(record);
  savePersistedStore(appStore);
  return record;
}

export function findPasswordResetToken(tokenHash: string): PasswordResetRecord | undefined {
  if (!Array.isArray(appStore.passwordResets)) return undefined;
  return appStore.passwordResets.find((t) => t.tokenHash === tokenHash);
}

export function markPasswordResetTokenUsed(id: number): boolean {
  if (!Array.isArray(appStore.passwordResets)) return false;
  const record = appStore.passwordResets.find((t) => t.id === id);
  if (record) {
    record.usedAt = new Date().toISOString();
    return savePersistedStore(appStore);
  }
  return false;
}
