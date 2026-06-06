'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { X, Download, ChevronDown, FileJson, FileSpreadsheet, ExternalLink } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import Toast, { ToastType } from '@/components/ui/Toast';
import { fetchAndExport } from '@/lib/utils/exportData';

const navItems = [
  { href: '/', label: 'Global usage' },
  { href: '/countries', label: 'Countries' },
  { href: '/compare', label: 'Compare' },
  { href: '/jobs', label: 'Job explorer' }
];

const exportOptions = [
  { id: 'countries-json', label: 'All countries (JSON)', file: 'countries.json', format: 'json' as const, icon: FileJson },
  { id: 'countries-csv', label: 'All countries (CSV)', file: 'countries.json', format: 'csv' as const, icon: FileSpreadsheet },
  { id: 'states-json', label: 'US states (JSON)', file: 'states.json', format: 'json' as const, icon: FileJson },
  { id: 'states-csv', label: 'US states (CSV)', file: 'states.json', format: 'csv' as const, icon: FileSpreadsheet },
  { id: 'global-json', label: 'Global summary (JSON)', file: 'global.json', format: 'json' as const, icon: FileJson },
  { id: 'api-json', label: 'API usage (JSON)', file: 'api.json', format: 'json' as const, icon: FileJson },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', visible: false });
  const [isExporting, setIsExporting] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap when sidebar is open on mobile
  useEffect(() => {
    if (!isOpen) return;

    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const focusableElements = sidebar.querySelectorAll(
      'a[href], button:not([disabled])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element when opened
    firstElement?.focus();

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    const handleEscapeDropdown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeDropdown);
    return () => document.removeEventListener('keydown', handleEscapeDropdown);
  }, [isDropdownOpen]);

  // Touch gesture handlers for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    // Swipe left to close (at least 50px)
    if (swipeDistance > 50) {
      onClose();
    }
  };

  // Show toast notification
  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, visible: true });
  };

  // Handle export
  const handleExport = async (file: string, format: 'json' | 'csv') => {
    if (isExporting) return;

    setIsExporting(true);
    setIsDropdownOpen(false);

    try {
      await fetchAndExport(file, format);
      showToast(
        `Successfully exported ${file.replace('.json', '')} as ${format.toUpperCase()}`,
        'success'
      );
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Export failed',
        'error'
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed md:static
          top-0 left-0 bottom-0
          w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          p-6 flex flex-col
          z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-cream-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>

        <div className="mb-8">
          <Link href="/" className="block">
            <h1 className="text-2xl font-serif mb-1 text-gray-900 dark:text-gray-100">Global Economic Index</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Understanding AI&apos;s effects on the economy</p>
          </Link>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 px-3 rounded text-sm transition-colors ${
                      isActive
                        ? 'bg-cream-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        : 'hover:bg-cream-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <ThemeToggle />

            {/* Export Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isExporting}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-cream-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span className="flex items-center gap-2">
                  <Download size={16} />
                  {isExporting ? 'Exporting...' : 'Download dataset'}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className="absolute bottom-full mb-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-50"
                  role="menu"
                >
                  <div className="py-1 max-h-80 overflow-y-auto">
                    {exportOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleExport(option.file, option.format)}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-cream-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-3"
                          role="menuitem"
                        >
                          <Icon size={16} className="text-gray-500 dark:text-gray-400" />
                          <span>{option.label}</span>
                        </button>
                      );
                    })}

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                    {/* Raw Data Link */}
                    <a
                      href="https://github.com/duyet/economic-index/tree/main/aei_v3_download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-cream-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-3"
                      role="menuitem"
                    >
                      <ExternalLink size={16} className="text-gray-500 dark:text-gray-400" />
                      <span>View raw data (GitHub)</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Last updated Sep 16, 2025</p>
        </div>

        {/* Toast Notification */}
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, visible: false })}
          />
        )}
      </aside>
    </>
  );
}
