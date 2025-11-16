'use client';

import { useMemo } from 'react';
import {
  UnifiedWaffleChart,
  createSquaresFromPercentages,
  type WaffleSquare,
  type TooltipPosition,
} from './UnifiedWaffleChart';

/**
 * Collaboration mode category for waffle chart
 */
interface CollaborationMode {
  key: string;
  name: string;
  value: number;
  color: string;
}

interface WaffleChartProps {
  data: {
    directive?: number;  // Automation (sage green)
    learning?: number;   // Augmentation (lavender)
    other?: number;      // No data (beige)
  };
  size?: number; // Grid size (default 12x12 = 144 squares)
}

/**
 * WaffleChart - Collaboration mode distribution visualization
 *
 * Displays collaboration modes (Directive, Task Iteration, Validation) as a waffle chart.
 * This is a lightweight wrapper around UnifiedWaffleChart.
 *
 * @example
 * <WaffleChart
 *   data={{ directive: 60, learning: 30, other: 10 }}
 *   size={12}
 * />
 */
export function WaffleChart({ data, size = 12 }: WaffleChartProps) {
  // Transform data into categories for the unified chart
  const categories = useMemo((): CollaborationMode[] => {
    const cats: CollaborationMode[] = [];

    if (data.directive) {
      cats.push({
        key: 'directive',
        name: 'Directive',
        value: data.directive,
        color: '#5A9770', // Sage green for automation
      });
    }

    if (data.learning) {
      cats.push({
        key: 'learning',
        name: 'Task Iteration',
        value: data.learning,
        color: '#B8A3D6', // Lavender for augmentation
      });
    }

    if (data.other) {
      cats.push({
        key: 'other',
        name: 'Validation',
        value: data.other,
        color: '#B8A3D6', // Lavender for augmentation (same as learning)
      });
    }

    return cats;
  }, [data.directive, data.learning, data.other]);

  // Create squares from percentage data
  const squares = useMemo(
    () => createSquaresFromPercentages(categories, size * size),
    [categories, size]
  );

  // Generate accessible description
  const accessibleDescription = useMemo(() => {
    const parts: string[] = [];
    if (data.directive) parts.push(`${Math.round(data.directive)}% Directive mode`);
    if (data.learning) parts.push(`${Math.round(data.learning)}% Task Iteration mode`);
    if (data.other) parts.push(`${Math.round(data.other)}% Validation mode`);

    return `Waffle chart showing collaboration mode distribution: ${parts.join(', ')}`;
  }, [data.directive, data.learning, data.other]);

  // Render tooltip content
  const renderTooltip = (square: WaffleSquare<CollaborationMode>) => {
    if (!square.data) return null;

    // Show all categories in tooltip
    return (
      <div className="space-y-1.5">
        {data.directive !== undefined && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#5A9770' }}></div>
              <span className="text-gray-200">Directive</span>
            </div>
            <span className="font-medium">{Math.round(data.directive)}%</span>
          </div>
        )}
        {data.learning !== undefined && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#B8A3D6' }}></div>
              <span className="text-gray-200">Task Iteration</span>
            </div>
            <span className="font-medium">{Math.round(data.learning)}%</span>
          </div>
        )}
        {data.other !== undefined && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#B8A3D6' }}></div>
              <span className="text-gray-200">Validation</span>
            </div>
            <span className="font-medium">{Math.round(data.other)}%</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <UnifiedWaffleChart
      squares={squares}
      size={size}
      accessibleDescription={accessibleDescription}
      renderTooltip={renderTooltip}
      tooltipMode="top-center"
    />
  );
}
