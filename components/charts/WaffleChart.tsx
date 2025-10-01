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

export function WaffleChart({ data, size = 12 }: WaffleChartProps) {
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
        className="grid gap-[2px] cursor-pointer"
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
            className="aspect-square rounded-[1px] transition-opacity hover:opacity-80"
            style={{ backgroundColor: getSquareColor(type) }}
          />
        ))}
      </div>

      {/* Hover tooltip */}
      {isHovered && (data.directive || data.learning) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white px-3 py-2.5 rounded text-xs whitespace-nowrap z-10 shadow-xl border border-gray-700">
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
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  );
}
