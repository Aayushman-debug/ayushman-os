import type { CSSProperties } from 'react';

export const THEME_STORAGE_KEY = 'ayushman_portfolio_theme';

export const THEMES = [
  { id: 'default', name: 'Default', preview: ['#07090e', '#9333ea', '#f1f5f9'], motion: 'original' },
  { id: 'experimental', name: 'Experimental', preview: ['#f5f1e8', '#ff4d2e', '#121212'], motion: 'snappy' },
  { id: 'liquid', name: 'Liquid Interface', preview: ['#07121b', '#5de3dc', '#e4fbff'], motion: 'fluid' },
  { id: 'editorial', name: 'Editorial', preview: ['#f2eee6', '#b6432f', '#211d19'], motion: 'reveal' },
  { id: 'terminal', name: 'Retro Terminal', preview: ['#07110b', '#8aff79', '#c3f7b6'], motion: 'console' },
  { id: 'play', name: 'Play Mode', preview: ['#17102b', '#ffbd59', '#fff8e8'], motion: 'spring' },
  { id: 'village', name: 'Cozy Village', preview: ['#fcf9f2', '#2d6a4f', '#c86d51'], motion: 'gentle' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const themeTokens: Record<ThemeId, CSSProperties> = {
  default: {},
  experimental: {
    '--theme-background': '#f5f1e8',
    '--theme-foreground': '#151412',
    '--theme-surface': '#fffdf8',
    '--theme-accent': '#ff4d2e',
    '--theme-muted': '#625e57',
    '--theme-border': 'rgba(21, 20, 18, 0.24)',
    '--theme-radius': '0.25rem',
  } as CSSProperties,
  liquid: {
    '--theme-background': '#07121b',
    '--theme-foreground': '#e4fbff',
    '--theme-surface': 'rgba(18, 42, 54, 0.72)',
    '--theme-accent': '#5de3dc',
    '--theme-muted': '#91b8c1',
    '--theme-border': 'rgba(164, 243, 245, 0.22)',
    '--theme-radius': '1.5rem',
  } as CSSProperties,
  editorial: {
    '--theme-background': '#f2eee6',
    '--theme-foreground': '#211d19',
    '--theme-surface': '#fffdf8',
    '--theme-accent': '#b6432f',
    '--theme-muted': '#756c60',
    '--theme-border': 'rgba(33, 29, 25, 0.2)',
    '--theme-radius': '0.5rem',
  } as CSSProperties,
  terminal: {
    '--theme-background': '#07110b',
    '--theme-foreground': '#c3f7b6',
    '--theme-surface': '#0a1a10',
    '--theme-accent': '#8aff79',
    '--theme-muted': '#72a77a',
    '--theme-border': 'rgba(138, 255, 121, 0.35)',
    '--theme-radius': '0.2rem',
  } as CSSProperties,
  play: {
    '--theme-background': '#17102b',
    '--theme-foreground': '#fff8e8',
    '--theme-surface': '#25183f',
    '--theme-accent': '#ffbd59',
    '--theme-muted': '#c7b9df',
    '--theme-border': 'rgba(255, 189, 89, 0.3)',
    '--theme-radius': '1.75rem',
  } as CSSProperties,
  village: {
    '--theme-background': '#fcf9f2',
    '--theme-foreground': '#2c251e',
    '--theme-surface': '#fffdfa',
    '--theme-surface-subtle': '#f5efe6',
    '--theme-accent': '#c86d51',
    '--theme-accent-hover': '#b85d43',
    '--theme-primary': '#2d6a4f',
    '--theme-primary-light': '#d8f3dc',
    '--theme-secondary': '#8ecae6',
    '--theme-wood': '#78350f',
    '--theme-wood-light': '#fef3c7',
    '--theme-muted': '#685e52',
    '--theme-border': 'rgba(120, 53, 15, 0.14)',
    '--theme-border-subtle': 'rgba(45, 106, 79, 0.12)',
    '--theme-radius': '1.25rem',
  } as CSSProperties,
};

function readSavedTheme(): ThemeId {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.find((theme) => theme.id === saved)?.id || 'default';
  } catch {
    return 'default';
  }
}

export const initialTheme: ThemeId = typeof window === 'undefined' ? 'default' : readSavedTheme();

if (typeof document !== 'undefined') {
  document.documentElement.dataset.portfolioTheme = initialTheme;
}
