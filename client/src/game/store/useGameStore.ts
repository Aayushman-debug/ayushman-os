/**
 * AYushMan: NEON DISTRICT — Global Game State
 * Zustand store for player position, district, interaction state, HUD,
 * audio settings, discovery log, camera perspective, collectibles, and touch input.
 */
import { create } from 'zustand';
import { sound } from '../audio/soundEngine';

export type District =
  | 'central_nexus'
  | 'memory_lane'
  | 'academia'
  | 'tech_core'
  | 'arcade_99'
  | 'skyport';

export type CameraMode = 'standard' | 'close' | 'tactical';

export interface InteractionTarget {
  id: string;
  label: string;
  hint: string;
  district: District;
}

export interface TouchInputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
}

interface GameStore {
  // Player
  playerPosition: [number, number, number];
  setPlayerPosition: (pos: [number, number, number]) => void;
  teleportTarget: [number, number, number] | null;
  setTeleportTarget: (pos: [number, number, number] | null) => void;

  // Camera perspective
  cameraMode: CameraMode;
  cycleCameraMode: () => void;

  // Touch controls
  touchInput: TouchInputState;
  setTouchInput: (input: Partial<TouchInputState>) => void;

  // Current district
  currentDistrict: District;
  setCurrentDistrict: (d: District) => void;

  // Interaction
  nearbyTarget: InteractionTarget | null;
  setNearbyTarget: (t: InteractionTarget | null) => void;
  activeOverlay: string | null;
  openOverlay: (id: string) => void;
  closeOverlay: () => void;

  // Game controls
  controlsLocked: boolean;
  setControlsLocked: (v: boolean) => void;

  // Minimap & Tactical Map
  minimapVisible: boolean;
  toggleMinimap: () => void;
  tacticalMapOpen: boolean;
  setTacticalMapOpen: (open: boolean) => void;

  // Sound
  soundMuted: boolean;
  toggleSoundMuted: () => void;

  // Discovery Log & Shards Collectibles
  visitedDistricts: string[];
  contactedNpcs: string[];
  collectedShards: string[];
  markDistrictVisited: (id: string) => void;
  markNpcVisited: (id: string) => void;
  collectShard: (id: string, title: string) => void;

  // Notifications
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  playerPosition: [0, 1, 0],
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  teleportTarget: null,
  setTeleportTarget: (pos) => set({ teleportTarget: pos }),

  cameraMode: 'standard',
  cycleCameraMode: () => {
    const modes: CameraMode[] = ['standard', 'close', 'tactical'];
    const current = get().cameraMode;
    const nextIdx = (modes.indexOf(current) + 1) % modes.length;
    const next = modes[nextIdx];
    sound.playClick(1000);
    get().setNotification(`CAMERA PERSPECTIVE // ${next.toUpperCase()} VIEW`);
    set({ cameraMode: next });
  },

  touchInput: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
  },
  setTouchInput: (input) =>
    set((s) => ({ touchInput: { ...s.touchInput, ...input } })),

  currentDistrict: 'central_nexus',
  setCurrentDistrict: (d) => set({ currentDistrict: d }),

  nearbyTarget: null,
  setNearbyTarget: (t) => set({ nearbyTarget: t }),

  activeOverlay: null,
  openOverlay: (id) => {
    sound.playTerminalOpen();
    get().markDistrictVisited(id);
    set({ activeOverlay: id, controlsLocked: true });
  },
  closeOverlay: () => {
    sound.playTerminalClose();
    set({ activeOverlay: null, controlsLocked: false });
  },

  controlsLocked: false,
  setControlsLocked: (v) => set({ controlsLocked: v }),

  minimapVisible: true,
  toggleMinimap: () => set((s) => ({ minimapVisible: !s.minimapVisible })),

  tacticalMapOpen: false,
  setTacticalMapOpen: (open) => {
    if (open) sound.playClick(750);
    set({ tacticalMapOpen: open, controlsLocked: open });
  },

  soundMuted: false,
  toggleSoundMuted: () => {
    const nextMuted = !get().soundMuted;
    sound.setMuted(nextMuted);
    set({ soundMuted: nextMuted });
  },

  visitedDistricts: ['central_nexus'],
  contactedNpcs: [],
  collectedShards: [],

  markDistrictVisited: (id) => {
    const { visitedDistricts, setNotification } = get();
    if (!visitedDistricts.includes(id)) {
      set({ visitedDistricts: [...visitedDistricts, id] });
      setNotification(`NEW ARCHIVE DISCOVERED // ${id.replace(/_/g, ' ').toUpperCase()}`);
      sound.playClick(1200);
    }
  },

  markNpcVisited: (id) => {
    const { contactedNpcs, setNotification } = get();
    if (!contactedNpcs.includes(id)) {
      set({ contactedNpcs: [...contactedNpcs, id] });
      setNotification(`SIGNAL ACQUIRED // ${id.toUpperCase()}`);
      sound.playClick(1400);
    }
  },

  collectShard: (id, title) => {
    const { collectedShards, setNotification } = get();
    if (!collectedShards.includes(id)) {
      const next = [...collectedShards, id];
      set({ collectedShards: next });
      sound.playClick(1600);
      setNotification(`DATA SHARD ACQUIRED (${next.length}/5) // ${title}`);
    }
  },

  notification: null,
  setNotification: (msg) => {
    set({ notification: msg });
    if (msg) {
      setTimeout(() => {
        if (get().notification === msg) {
          set({ notification: null });
        }
      }, 4000);
    }
  },
}));
