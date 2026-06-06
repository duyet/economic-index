import React from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  className?: string;
  highlight?: boolean;
  loading?: boolean;
}

export function MetricCard({
  label,
  value,
  description,
  className,
  highlight = false,
  loading = false,
}: MetricCardProps) {
  if (loading) {
    return (
      <article
        className={clsx(
          'relative overflow-hidden',
          'p-6 rounded-xl',
          'bg-white shadow-soft',
          'border border-gray-100',
          className
        )}
        aria-label="Loading metric"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent animate-shimmer" />
        <div className="space-y-3">
          <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </article>
    );
  }

  return (
    <article
      className={clsx(
        'group relative overflow-hidden',
        'p-6 rounded-xl',
        'transition-all duration-300 ease-out',
        'hover:scale-[1.02] hover:-translate-y-1',
        highlight
          ? [
              'bg-gradient-to-br from-teal-50 via-white to-teal-50/50',
              'border-2 border-teal-200',
              'shadow-soft-lg hover:shadow-glow-teal',
            ]
          : [
              'bg-white',
              'border border-gray-100',
              'shadow-soft hover:shadow-soft-lg',
              'hover:border-teal-100',
            ],
        className
      )}
      role="article"
      aria-label={`${label}: ${value}${description ? '. ' + description : ''}`}
    >
      {/* Subtle gradient overlay for highlight cards */}
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Content */}
      <div className="relative z-10">
        <div
          className={clsx(
            'text-4xl font-bold mb-2',
            'transition-colors duration-300',
            highlight
              ? 'text-teal-600 group-hover:text-teal-700'
              : 'text-gray-900 group-hover:text-teal-600'
          )}
          aria-hidden="true"
        >
          {value}
        </div>
        <div
          className={clsx(
            'text-sm font-semibold tracking-wide uppercase',
            highlight ? 'text-teal-700' : 'text-gray-600'
          )}
          aria-hidden="true"
        >
          {label}
        </div>
        {description && (
          <div
            className={clsx(
              'text-xs mt-2 leading-relaxed',
              highlight ? 'text-teal-600/80' : 'text-gray-500'
            )}
            aria-hidden="true"
          >
            {description}
          </div>
        )}
      </div>

      {/* Accent line at bottom */}
      <div
        className={clsx(
          'absolute bottom-0 left-0 right-0 h-1',
          'bg-gradient-to-r',
          highlight
            ? 'from-teal-400 via-teal-500 to-teal-400'
            : 'from-transparent via-teal-200 to-transparent opacity-0 group-hover:opacity-100',
          'transition-opacity duration-300'
        )}
      />
    </article>
  );
}
