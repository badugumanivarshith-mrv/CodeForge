import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem('cf_theme') as Theme | null;
  if (stored) return stored;
  return 'dark';
};

export const useThemeStore = create<ThemeState>(set => ({
  theme: getInitialTheme(),

  toggleTheme: () =>
    set(state => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cf_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return { theme: newTheme };
    }),

  setTheme: (theme: Theme) => {
    localStorage.setItem('cf_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
}));
