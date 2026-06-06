'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const context = useTheme();

  // Handle case where component is rendered outside ThemeProvider
  if (!context) {
    return null;
  }

  const { theme, toggleTheme } = context;

  return (
    <button
      onClick={toggleTheme}
      className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-cream-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center gap-2"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon size={16} aria-hidden="true" />
          <span>Dark mode</span>
        </>
      ) : (
        <>
          <Sun size={16} aria-hidden="true" />
          <span>Light mode</span>
        </>
      )}
    </button>
  );
}
