import React from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  className?: string;
  highlight?: boolean;
}

export function MetricCard({
  label,
  value,
  description,
  className,
  highlight = false,
}: MetricCardProps) {
  return (
    <div
      className={clsx(
        'p-4 rounded-lg',
        highlight ? 'bg-teal-50 border-2 border-teal-200' : 'bg-gray-50',
        className
      )}
    >
      <div
        className={clsx(
          'text-3xl font-bold mb-1',
          highlight ? 'text-teal-600' : 'text-gray-900'
        )}
      >
        {value}
      </div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
    </div>
  );
}
