import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

const themes: Record<Theme, ThemeColors> = {
  light: {
    primary: '#003366',    // Bleu foncé
    secondary: '#FF9900',  // Orange
    background: '#FFFFFF', // Blanc
    text: '#000000'
  },
  dark: {
    primary: '#001F33',    // Bleu très foncé
    secondary: '#CC7A00',  // Orange foncé
    background: '#1A1A1A', // Fond sombre
    text: '#E0E0E0'       // Gris clair
  }
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Appliquer les couleurs CSS personnalisées
    const colors = themes[theme];
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--background-color', colors.background);
    document.documentElement.style.setProperty('--text-color', colors.text);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    toggleTheme,
    colors: themes[theme]
  };
}