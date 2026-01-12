"use client";

import { createContext, useState, useEffect, useContext } from 'react';

const UserThemeContext = createContext();

export const useUserTheme = () => {
  const context = useContext(UserThemeContext);
  if (!context) throw new Error('useUserTheme must be used within UserThemeProvider');
  return context;
};

export default function UserThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Force remove all dark classes
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    
    // Force add light classes
    document.documentElement.classList.add('light');
    document.body.classList.add('light');
    
    // Force light background on body
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#111827';
    
    // Also set html background
    document.documentElement.style.backgroundColor = '#ffffff';
    
    setMounted(true);
    
    // Cleanup function to remove inline styles when unmounting
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#ffffff'}}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <UserThemeContext.Provider value={{ theme }}>
      <div className="min-h-screen bg-white text-gray-900" style={{backgroundColor: '#ffffff', color: '#111827'}}>
        {children}
      </div>
    </UserThemeContext.Provider>
  );
}