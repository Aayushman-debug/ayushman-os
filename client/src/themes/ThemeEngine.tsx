import React, { useCallback, useMemo, useState } from 'react';
import { ThemeContext } from './themeContext';
import { initialTheme, THEME_STORAGE_KEY, THEMES, themeTokens, type ThemeId } from './themeConfig';

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(initialTheme);

  const setTheme = useCallback((nextTheme: ThemeId) => {
    const validTheme = THEMES.find((item) => item.id === nextTheme)?.id || 'default';
    document.documentElement.dataset.portfolioTheme = validTheme;
    setThemeState(validTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, validTheme);
    } catch (error) {
      console.warn('[Theme] Could not persist selected theme:', error);
    }
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, tokens: themeTokens[theme] }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className="portfolio-shell" data-theme-motion={THEMES.find((item) => item.id === theme)?.motion} style={value.tokens}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
