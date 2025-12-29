
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

type Language = 'en' | 'fr';
type Theme = 'light' | 'dark';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: any; // Translation object
  isBackendOnline: boolean;
  setBackendOnline: (status: boolean) => void;
  showAbout: boolean;
  setShowAbout: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app_language') as Language) || 'en';
  });
  
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('app_theme') as Theme) || 'light';
  });

  const [isBackendOnline, setBackendOnline] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Helper to update state and localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const toggleTheme = () => {
    setThemeState(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('app_theme', newTheme);
      return newTheme;
    });
  };

  // Toggle Dark Mode Class on HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const t = translations[language];

  return (
    <AppContext.Provider value={{ 
      language, 
      setLanguage, 
      theme, 
      toggleTheme, 
      t, 
      isBackendOnline, 
      setBackendOnline,
      showAbout,
      setShowAbout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
