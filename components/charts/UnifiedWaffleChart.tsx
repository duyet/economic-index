'use client';

import { useState, ReactNode } from 'react';

/**
 * Generic waffle chart square data
 * Can represent collaboration modes, tasks, or any categorical data
 */
export interface WaffleSquare<T = unknown> {
  /** The data item this square represents (can be null for empty squares) */
  data: T | null;
  /** Color for this square */
  color: string;
  /** Unique key for React rendering */
  key: string | number;
}

/**
 * Tooltip position for precise positioning
 */
export interface TooltipPosition {
  x: number;
  y: number;
}

/**
 * Props for the unified waffle chart component
 */
export interface UnifiedWaffleChartProps<T = unknown> {
  /** Array of squares to render in the grid */
  squares: WaffleSquare<T>[];

  /** Grid size (creates size x size grid). Default: 12 */
  size?: number;

  /** Accessible description for screen readers */
  accessibleDescription: string;

  /** Render function for tooltip content when hovering over a square */
  renderTooltip?: (square: WaffleSquare<T>, position: TooltipPosition) => ReactNode;

  /** Whether to show tooltip on hover. Default: true */
  showTooltip?: boolean;

  /** Tooltip positioning mode */
  tooltipMode?: 'top-center' | 'fixed';

  /** Additional CSS classes for the container */
  className?: string;

  /** Callback when a square is hovered */
  onSquareHover?: (square: WaffleSquare<T>, position: TooltipPosition) => void;

  /** Callback when hover leaves a square */
  onSquareLeave?: () => void;
}

/**
 * UnifiedWaffleChart - A generic waffle chart component for visualizing categorical data
 *
 * Features:
 * - Configurable grid size (default 12x12 = 144 squares)
 * - Generic data types with TypeScript support
 * - Customizable tooltips with multiple positioning modes
 * - Full accessibility support (ARIA labels, keyboard navigation)
 * - Smooth hover interactions
 *
 * @example
 * // Collaboration mode chart
 * <UnifiedWaffleChart
 *   squares={modeSquares}
 *   accessibleDescription="Collaboration modes: 60% Directive, 40% Learning"
 *   renderTooltip={(square) => <div>{square.data.name}</div>}
 * />
 *
 * @example
 * // Task distribution chart
 * <UnifiedWaffleChart
 *   squares={taskSquares}
 *   tooltipMode="fixed"
 *   accessibleDescription="Task distribution across 15 O*NET categories"
 *   renderTooltip={(square, pos) => <TaskTooltip task={square.data} position={pos} />}
 * />
 */
export function UnifiedWaffleChart<T = unknown>({
  squares,
  size = 12,
  accessibleDescription,
  renderTooltip,
  showTooltip = true,
  tooltipMode = 'top-center',
  className = '',
  onSquareHover,
  onSquareLeave,
}: UnifiedWaffleChartProps<T>) {
  const [hoveredSquare, setHoveredSquare] = useState<WaffleSquare<T> | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);

  const totalSquares = size * size;

  // Ensure we have the correct number of squares
  if (squares.length !== totalSquares) {
    console.warn(
      `UnifiedWaffleChart: Expected ${totalSquares} squares but received ${squares.length}. ` +
      `Grid size is ${size}x${size}.`
    );
  }

  const handleSquareEnter = (square: WaffleSquare<T>, event: React.MouseEvent) => {
    if (!showTooltip || !square.data) return;

    setHoveredSquare(square);

    if (tooltipMode === 'fixed') {
      // Fixed positioning relative to viewport
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    } else {
      // Top-center positioning (relative positioning handled by CSS)
      setTooltipPosition({ x: 0, y: 0 });
    }

    onSquareHover?.(square, tooltipPosition);
  };

  const handleSquareLeave = () => {
    setHoveredSquare(null);
    onSquareLeave?.();
  };

  const handleFocus = () => {
    setIsKeyboardFocused(true);
  };

  const handleBlur = () => {
    setIsKeyboardFocused(false);
    setHoveredSquare(null);
  };

  const shouldShowTooltip = showTooltip && hoveredSquare && renderTooltip;

  return (
    <div className={`relative ${className}`}>
      {/* Grid container */}
      <div
        role="img"
        aria-label={accessibleDescription}
        className="grid gap-[2px] cursor-pointer"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
      >
        {squares.map((square) => (
          <div
            key={square.key}
            className={`
              aspect-square rounded-[1px] transition-opacity
              ${square.data ? 'hover:opacity-80' : ''}
              ${tooltipMode === 'fixed' && square.data ? 'hover:ring-1 hover:ring-gray-400' : ''}
            `}
            style={{ backgroundColor: square.color }}
            onMouseEnter={(e) => handleSquareEnter(square, e)}
            onMouseLeave={handleSquareLeave}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Tooltip */}
      {shouldShowTooltip && (
        <div
          role="tooltip"
          aria-live="polite"
          className={`
            bg-gray-800 text-white px-3 py-2.5 rounded text-xs shadow-xl border border-gray-700 z-50
            ${tooltipMode === 'fixed'
              ? 'fixed max-w-sm'
              : 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap'
            }
          `}
          style={
            tooltipMode === 'fixed'
              ? {
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y - 10}px`,
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'none',
                }
              : undefined
          }
        >
          {renderTooltip(hoveredSquare, tooltipPosition)}

          {/* Tooltip arrow */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1"
            style={{ pointerEvents: 'none' }}
          >
            <div className="border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}

      {/* Keyboard focus indicator (optional enhancement) */}
      {isKeyboardFocused && (
        <div className="absolute inset-0 pointer-events-none ring-2 ring-blue-500 ring-offset-2 rounded" />
      )}
    </div>
  );
}

/**
 * Utility function to create waffle squares from percentage data
 *
 * @param categories - Array of { key, value (percentage), color }
 * @param totalSquares - Total number of squares in grid (size * size)
 * @returns Array of WaffleSquare objects
 */
export function createSquaresFromPercentages<T extends { key: string; value: number; color: string; data?: unknown }>(
  categories: T[],
  totalSquares: number
): WaffleSquare<T>[] {
  const squares: WaffleSquare<T>[] = [];
  let squareIndex = 0;

  categories.forEach((category) => {
    const squareCount = Math.round((category.value / 100) * totalSquares);

    for (let i = 0; i < squareCount; i++) {
      squares.push({
        data: category,
        color: category.color,
        key: `${category.key}-${squareIndex++}`,
      });
    }
  });

  // Fill remaining squares with empty squares
  while (squares.length < totalSquares) {
    squares.push({
      data: null,
      color: '#E8E4DC', // Default empty color (beige)
      key: `empty-${squareIndex++}`,
    });
  }

  return squares;
}

/**
 * Utility function to create waffle squares from weighted items (e.g., tasks with usage percentages)
 *
 * @param items - Array of items with weights
 * @param getWeight - Function to extract weight from item
 * @param getColor - Function to get color for item
 * @param totalSquares - Total number of squares in grid
 * @returns Array of WaffleSquare objects
 */
export function createSquaresFromWeightedItems<T>(
  items: T[],
  getWeight: (item: T) => number,
  getColor: (item: T) => string,
  totalSquares: number
): WaffleSquare<T>[] {
  const squares: WaffleSquare<T>[] = [];

  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + getWeight(item), 0);

  if (totalWeight === 0) {
    // All empty squares if no weight
    return Array.from({ length: totalSquares }, (_, i) => ({
      data: null,
      color: '#E8E4DC',
      key: `empty-${i}`,
    }));
  }

  let remainingSquares = totalSquares;
  let squareIndex = 0;

  items.forEach((item, index) => {
    const itemPercentage = (getWeight(item) / totalWeight) * 100;
    let squaresForItem = Math.round((itemPercentage / 100) * totalSquares);

    // Ensure we don't exceed total squares
    if (index === items.length - 1) {
      squaresForItem = remainingSquares;
    } else {
      squaresForItem = Math.min(squaresForItem, remainingSquares);
    }

    remainingSquares -= squaresForItem;

    for (let i = 0; i < squaresForItem; i++) {
      squares.push({
        data: item,
        color: getColor(item),
        key: `item-${index}-${squareIndex++}`,
      });
    }
  });

  // Fill remaining squares with empty squares
  while (squares.length < totalSquares) {
    squares.push({
      data: null,
      color: '#E8E4DC',
      key: `empty-${squareIndex++}`,
    });
  }

  return squares;
}
