import { useEffect, useState } from 'react';

const THEME_KEY = 'inib-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      return savedTheme || 'light';
    } catch (error) {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
