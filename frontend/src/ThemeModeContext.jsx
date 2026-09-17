import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';

const STORAGE_KEY = 'omegation-theme-mode';
const ThemeModeContext = createContext({ mode: 'dark', toggleMode: () => {} });

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

function getInitialMode() {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (stored === 'light' || stored === 'dark') return stored;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  const theme = useMemo(() => getTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggleMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
