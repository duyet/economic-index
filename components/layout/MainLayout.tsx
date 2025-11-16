'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-cream-50 dark:bg-gray-900 overflow-hidden">
      {/* Hamburger menu button for mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-cream-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        aria-label="Open navigation menu"
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
      >
        <Menu size={24} />
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main
        id="main-content"
        className={`
          flex-1 overflow-auto
          ${fullWidth ? 'p-0' : 'p-6 md:p-12'}
          ${!fullWidth ? 'pt-16 md:pt-12' : ''}
        `}
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>
    </div>
  );
}
