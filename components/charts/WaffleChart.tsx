'use client';

import { useState } from 'react';

interface WaffleChartProps {
  data: {
    directive?: number;  // Automation (sage green)
    learning?: number;   // Augmentation (lavender)
    other?: number;      // No data (beige)
  };
  size?: number; // Grid size (default 10x10 = 100 squares)
}

export function WaffleChart({ data, size = 10 }: WaffleChartProps) {
  const [isHovered, setIsHovered] = useState(false);

  const totalSquares = size * size;

  // Calculate number of squares for each category
  const directiveSquares = Math.round((data.directive || 0) * totalSquares / 100);
  const learningSquares = Math.round((data.learning || 0) * totalSquares / 100);
  const otherSquares = totalSquares - directiveSquares - learningSquares;

  // Create array of square colors
  const squares = [
    ...Array(directiveSquares).fill('directive'),
    ...Array(learningSquares).fill('learning'),
    ...Array(otherSquares).fill('other')
  ];

  const getSquareColor = (type: string) => {
    switch (type) {
      case 'directive':
        return '#5A9770'; // Sage green for automation
      case 'learning':
        return '#B8A3D6'; // Lavender for augmentation
      default:
        return '#E8E4DC'; // Beige for no data
    }
  };

  return (
    <div className="relative">
      <div
        className="grid gap-0.5 cursor-pointer"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {squares.map((type, index) => (
          <div
            key={index}
            className="aspect-square rounded-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: getSquareColor(type) }}
          />
        ))}
      </div>

      {/* Hover tooltip */}
      {isHovered && (data.directive || data.learning) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white px-3 py-2 rounded text-xs whitespace-nowrap z-10">
          {data.directive && (
            <div>Directive: {data.directive.toFixed(0)}%</div>
          )}
          {data.learning && (
            <div>Learning: {data.learning.toFixed(0)}%</div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}
