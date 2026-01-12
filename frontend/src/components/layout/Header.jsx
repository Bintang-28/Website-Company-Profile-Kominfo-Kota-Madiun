"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Sun, Moon, LogOut, User as UserIcon } from "lucide-react";
import { useAdminTheme } from "@/context/AdminThemeProvider";
import { useAuth } from "@/context/AuthProvider";

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useAdminTheme();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="themed-card flex items-center justify-between px-4 md:px-6 py-4 border-b">
      <button
        className="md:hidden block text-gray-600 dark:text-gray-300"
        onClick={onMenuClick}
      >
        <Menu />
      </button>
      <h1 className="font-bold text-xl hidden md:block">Admin</h1>
      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === 'light' ? <Moon className="text-gray-600 dark:text-gray-300" /> : <Sun className="text-yellow-400" />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center space-x-2 bg-blue-100 dark:bg-blue-900 px-3 md:px-4 py-2 rounded-full text-blue-600 dark:text-blue-200 font-semibold w-auto min-w-[100px] md:min-w-[130px]"
          >
            <UserIcon size={16} className="flex-shrink-0" />
            <span className="text-sm md:text-base whitespace-nowrap">{user ? user.name : 'Admin'}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 themed-card rounded-md shadow-lg py-1 z-50 border">
              <button
                onClick={logout}
                className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}