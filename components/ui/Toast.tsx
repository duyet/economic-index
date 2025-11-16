'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-600 dark:text-green-400" />,
    error: <AlertCircle size={20} className="text-red-600 dark:text-red-400" />,
    info: <Info size={20} className="text-blue-600 dark:text-blue-400" />
  };

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
  };

  const textColors = {
    success: 'text-green-800 dark:text-green-200',
    error: 'text-red-800 dark:text-red-200',
    info: 'text-blue-800 dark:text-blue-200'
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        flex items-center gap-3
        px-4 py-3 rounded-lg border shadow-lg
        max-w-md
        animate-slide-up
        ${bgColors[type]}
      `}
      role="alert"
      aria-live="polite"
    >
      {icons[type]}
      <p className={`flex-1 text-sm font-medium ${textColors[type]}`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${textColors[type]}`}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
