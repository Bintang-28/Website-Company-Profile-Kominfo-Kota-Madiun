"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const AdminThemeContext = createContext();

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider');
  }
  return context;
}

export default function AdminThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else {
      // Detect system preference if no saved theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    }
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      // Save theme to localStorage
      localStorage.setItem('admin-theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}