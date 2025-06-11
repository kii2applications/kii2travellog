
import React, { createContext, useContext, useEffect } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useUserSettings();
  
  const theme = settings?.theme || 'dark';
  
  const getActualTheme = (theme: Theme): 'light' | 'dark' => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const actualTheme = getActualTheme(theme);

  const setTheme = (newTheme: Theme) => {
    updateSettings({ theme: newTheme });
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(actualTheme);
    
    // Update CSS custom properties based on theme
    if (actualTheme === 'light') {
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '222.2 84% 4.9%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
    } else {
      root.style.setProperty('--background', '222.2 84% 4.9%');
      root.style.setProperty('--foreground', '210 40% 98%');
      root.style.setProperty('--card', '222.2 84% 4.9%');
      root.style.setProperty('--card-foreground', '210 40% 98%');
    }
  }, [actualTheme]);

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const root = document.documentElement;
        const newActualTheme = getActualTheme('system');
        root.classList.remove('light', 'dark');
        root.classList.add(newActualTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
