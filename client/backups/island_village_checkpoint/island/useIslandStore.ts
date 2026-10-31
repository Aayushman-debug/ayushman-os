/**
 * useIslandStore.ts — Island Life Game State
 *
 * Tracks player location, active interaction targets, audio settings,
 * exploration telemetry, and custom Roblox avatar appearance persistence.
 */
import { create } from 'zustand';
import { islandAudio } from './islandAudio';
import { AvatarConfig, DEFAULT_AVATAR } from './avatarTypes';

export interface IslandTarget {
  id: string;
  title: string;
  subtitle: string;
  category?: 'landmark' | 'building' | 'signpost';
  actionLabel?: string;
}

const STORAGE_KEY = 'ayushman_island_avatar_v1';
const STARS_STORAGE_KEY = 'ayushman_island_stars_v1';

function getStoredAvatar(): AvatarConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_AVATAR, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_AVATAR;
}

function getStoredStars(): string[] {
  try {
    const raw = localStorage.getItem(STARS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

export interface DialogueState {
  speaker: string;
  title: string;
  avatarIcon?: string;
  lines: string[];
  currentLine: number;
}

export interface InspectAction {
  label: string;
  route?: string;
  externalUrl?: string;
  variant?: 'primary' | 'secondary' | 'accent';
  emoji?: string;
}

export interface InspectContent {
  title: string;
  subtitle: string;
  badge?: string;
  sections: { heading?: string; body: string }[];
  actions?: InspectAction[];
}

interface IslandStore {
  // Player position
  playerPosition: [number, number, number];
  setPlayerPosition: (pos: [number, number, number]) => void;

  // Island location
  currentArea: string;
  setCurrentArea: (area: string) => void;

  // Teleporting / Fast Travel
  teleportTarget: [number, number, number] | null;
  teleportTo: (pos: [number, number, number], name?: string) => void;
  consumeTeleport: () => [number, number, number] | null;

  // Interaction
  nearbyTarget: IslandTarget | null;
  setNearbyTarget: (t: IslandTarget | null) => void;
  activeDialog: IslandTarget | null;
  openDialog: (t: IslandTarget) => void;
  closeDialog: () => void;

  // NPC Dialogue
  activeDialogue: DialogueState | null;
  startDialogue: (speaker: string, title: string, lines: string[], avatarIcon?: string) => void;
  advanceDialogue: () => void;
  closeDialogue: () => void;

  // Content Inspection (Terminal, Books, Fireplace)
  inspectData: InspectContent | null;
  openInspect: (data: InspectContent) => void;
  closeInspect: () => void;

  // Fullscreen World Map
  isMapOpen: boolean;
  setMapOpen: (open: boolean) => void;

  // Collectibles (Hidden Stars)
  collectedStars: string[];
  collectStar: (id: string, name: string) => void;

  // Controls lock (during dialog / modal)
  controlsLocked: boolean;
  setControlsLocked: (locked: boolean) => void;

  // Audio
  isMuted: boolean;
  toggleAudio: () => void;

  // Discovery tracking
  visitedAreas: string[];
  markAreaVisited: (area: string) => void;
  toastMessage: string | null;
  setToast: (msg: string | null) => void;

  // Avatar customization
  avatar: AvatarConfig;
  setAvatar: (updates: Partial<AvatarConfig>) => void;
  applyPreset: (config: AvatarConfig) => void;
  saveAvatar: (newConfig?: AvatarConfig) => void;
  resetAvatar: () => void;
  isCustomizerOpen: boolean;
  setCustomizerOpen: (open: boolean) => void;
}

export const useIslandStore = create<IslandStore>((set, get) => ({
  playerPosition: [0, 1.5, 4.5],
  setPlayerPosition: (pos) => {
    const cur = get().playerPosition;
    const dx = cur[0] - pos[0];
    const dy = cur[1] - pos[1];
    const dz = cur[2] - pos[2];
    if (dx * dx + dy * dy + dz * dz > 0.04) {
      set({ playerPosition: pos });
    }
  },

  currentArea: 'SUNSHINE PLAZA',
  setCurrentArea: (area) => set({ currentArea: area }),

  teleportTarget: null,
  teleportTo: (pos, name) => {
    islandAudio.playJump();
    set({
      teleportTarget: pos,
      playerPosition: pos,
      isMapOpen: false,
      controlsLocked: false,
    });
    if (name) {
      get().setToast(`WARPED // ${name}`);
    }
  },
  consumeTeleport: () => {
    const target = get().teleportTarget;
    if (target) {
      set({ teleportTarget: null });
    }
    return target;
  },

  nearbyTarget: null,
  setNearbyTarget: (t) => set({ nearbyTarget: t }),

  activeDialog: null,
  openDialog: (t) => {
    islandAudio.playChime();
    set({ activeDialog: t, controlsLocked: true });
  },
  closeDialog: () => set({ activeDialog: null, controlsLocked: false }),

  // NPC Dialogue
  activeDialogue: null,
  startDialogue: (speaker, title, lines, avatarIcon = '💬') => {
    islandAudio.playTalk();
    set({
      activeDialogue: {
        speaker,
        title,
        avatarIcon,
        lines,
        currentLine: 0,
      },
      controlsLocked: true,
    });
  },
  advanceDialogue: () => {
    const cur = get().activeDialogue;
    if (!cur) return;
    if (cur.currentLine < cur.lines.length - 1) {
      islandAudio.playTalk();
      set({
        activeDialogue: {
          ...cur,
          currentLine: cur.currentLine + 1,
        },
      });
    } else {
      islandAudio.playChime(784);
      set({ activeDialogue: null, controlsLocked: false });
    }
  },
  closeDialogue: () => {
    set({ activeDialogue: null, controlsLocked: false });
  },

  // Inspection
  inspectData: null,
  openInspect: (data) => {
    islandAudio.playChime(600);
    set({ inspectData: data, controlsLocked: true });
  },
  closeInspect: () => {
    set({ inspectData: null, controlsLocked: false });
  },

  // Map
  isMapOpen: false,
  setMapOpen: (open) => {
    if (open) islandAudio.playChime(550);
    set({ isMapOpen: open, controlsLocked: open });
  },

  // Collectibles
  collectedStars: getStoredStars(),
  collectStar: (id, name) => {
    const { collectedStars, setToast } = get();
    if (!collectedStars.includes(id)) {
      const updated = [...collectedStars, id];
      try {
        localStorage.setItem(STARS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      islandAudio.playCollectible();
      set({ collectedStars: updated });
      if (updated.length >= 4) {
        setToast(`🏆 ALL 4 STARS COLLECTED // MASTER ISLAND EXPLORER!`);
      } else {
        setToast(`🌟 STAR COLLECTED (${updated.length}/4) // ${name}`);
      }
    }
  },

  controlsLocked: false,
  setControlsLocked: (locked) => set({ controlsLocked: locked }),

  isMuted: false,
  toggleAudio: () => {
    const next = !get().isMuted;
    islandAudio.setMuted(next);
    set({ isMuted: next });
  },

  visitedAreas: ['SUNSHINE PLAZA'],
  markAreaVisited: (area) => {
    const { visitedAreas, setToast } = get();
    if (!visitedAreas.includes(area)) {
      set({ visitedAreas: [...visitedAreas, area] });
      setToast(`DISCOVERED // ${area}`);
      islandAudio.playChime(784); // G5 note
    }
  },

  toastMessage: null,
  setToast: (msg) => {
    set({ toastMessage: msg });
    if (msg) {
      setTimeout(() => {
        if (get().toastMessage === msg) {
          set({ toastMessage: null });
        }
      }, 4000);
    }
  },

  // Avatar state
  avatar: getStoredAvatar(),
  setAvatar: (updates) => {
    const next = { ...get().avatar, ...updates };
    set({ avatar: next });
  },
  applyPreset: (config) => {
    set({ avatar: { ...config } });
    islandAudio.playChime(659);
  },
  saveAvatar: (newConfig) => {
    const target = newConfig || get().avatar;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(target));
    } catch {}
    get().setToast('AVATAR SAVED // LOOKS GREAT!');
    islandAudio.playChime(880);
    set({ avatar: target, isCustomizerOpen: false, controlsLocked: false });
  },
  resetAvatar: () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_AVATAR));
    } catch {}
    set({ avatar: { ...DEFAULT_AVATAR } });
    islandAudio.playChime(440);
  },
  isCustomizerOpen: false,
  setCustomizerOpen: (open) => {
    if (open) islandAudio.playChime(523);
    set({ isCustomizerOpen: open, controlsLocked: open });
  },
}));
