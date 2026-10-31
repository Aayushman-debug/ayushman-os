import { useContext } from 'react';
import { ThemeContext } from './themeContext';

export function usePortfolioTheme() {
  return useContext(ThemeContext);
}
