import { createContext } from 'react';
import type { CSSProperties } from 'react';
import { initialTheme, themeTokens, type ThemeId } from './themeConfig';

export interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  tokens: CSSProperties;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: initialTheme,
  setTheme: () => {},
  tokens: themeTokens[initialTheme],
});
