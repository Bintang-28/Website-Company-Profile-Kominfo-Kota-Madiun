// src/context/ThemeProvider.jsx
"use client";

import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isClient, setIsClient] = useState(false);

  // Pastikan kode ini hanya berjalan di client-side
  useEffect(() => {
    setIsClient(true);
    // Cek tema yang tersimpan saat pertama kali dimuat
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Jangan jalankan di server-side
    
    const root = document.documentElement;
    
    // Hapus kelas tema lama, tambahkan yang baru
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);

    // Simpan tema ke localStorage
    localStorage.setItem('theme', theme);
  }, [theme, isClient]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Render children langsung tanpa Material Tailwind ThemeProvider dulu
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}