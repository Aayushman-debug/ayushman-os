/**
 * useDialogStore.ts — Zustand store for the NPC dialog system
 *
 * Handles dialog tree state: current speaker, current line,
 * choices, and transition to actions (navigate, open overlay, etc.)
 */
import { create } from 'zustand';

export interface DialogLine {
  id: string;
  speaker: string;
  speakerColor: string;
  text: string;
  /** Optional glitch/typewriter effect class */
  style?: 'normal' | 'glitch' | 'system';
  next?: string | null;       // next line id, null = end dialog
  choices?: DialogChoice[];   // if present, show choice buttons
}

export interface DialogChoice {
  label: string;
  next: string | null;        // null = close dialog
  action?: () => void;        // optional side-effect
}

export interface DialogTree {
  id: string;
  lines: Record<string, DialogLine>;
  startLine: string;
}

interface DialogStore {
  active: boolean;
  tree: DialogTree | null;
  currentLineId: string | null;

  openDialog: (tree: DialogTree) => void;
  advance: (nextId: string | null) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogStore>((set, get) => ({
  active: false,
  tree: null,
  currentLineId: null,

  openDialog: (tree) =>
    set({ active: true, tree, currentLineId: tree.startLine }),

  advance: (nextId) => {
    if (nextId === null) {
      get().closeDialog();
    } else {
      set({ currentLineId: nextId });
    }
  },

  closeDialog: () =>
    set({ active: false, tree: null, currentLineId: null }),
}));
