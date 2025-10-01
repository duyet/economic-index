'use client';

import { useRouter } from 'next/navigation';

interface WorldMapProps {
  data?: Record<string, number>;
}

export default function WorldMap({ data = {} }: WorldMapProps) {
  const router = useRouter();

  const getColor = (countryCode: string) => {
    const value = data[countryCode] || 0;
    if (value >= 4) return '#117763'; // Leading
    if (value >= 3) return '#4DCAB6'; // Upper middle
    if (value >= 2) return '#80D9CB'; // Lower middle
    if (value >= 1) return '#B3E8E0'; // Emerging
    return '#E6F7F5'; // Minimal
  };

  const handleCountryClick = (countryCode: string) => {
    router.push(`/country/${countryCode.toLowerCase()}`);
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-auto"
        style={{ maxHeight: '400px' }}
      >
        {/* Simplified world map SVG */}
        <g>
          {/* United States */}
          <path
            d="M 150 150 L 250 140 L 280 180 L 270 220 L 220 230 L 180 210 Z"
            fill={getColor('US')}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-80 cursor-pointer transition-opacity"
            onClick={() => handleCountryClick('US')}
          >
            <title>United States</title>
          </path>

          {/* United Kingdom */}
          <path
            d="M 490 120 L 510 115 L 515 130 L 500 135 Z"
            fill={getColor('GB')}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-80 cursor-pointer transition-opacity"
            onClick={() => handleCountryClick('GB')}
          >
            <title>United Kingdom</title>
          </path>

          {/* Canada */}
          <path
            d="M 150 80 L 300 70 L 310 110 L 280 120 L 200 130 L 160 110 Z"
            fill={getColor('CA')}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-80 cursor-pointer transition-opacity"
            onClick={() => handleCountryClick('CA')}
          >
            <title>Canada</title>
          </path>

          {/* Germany */}
          <path
            d="M 520 135 L 540 130 L 545 145 L 530 150 Z"
            fill={getColor('DE')}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-80 cursor-pointer transition-opacity"
            onClick={() => handleCountryClick('DE')}
          >
            <title>Germany</title>
          </path>

          {/* France */}
          <path
            d="M 500 145 L 520 140 L 525 160 L 510 165 Z"
            fill={getColor('FR')}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-80 cursor-pointer transition-opacity"
            onClick={() => handleCountryClick('FR')}
          >
            <title>France</title>
          </path>

          {/* Australia */}
          <path
            d="M 800 350 L 880 340 L 900 380 L 870 400 L 810 390 Z"
            fill={getColor('AU')}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-80 cursor-pointer transition-opacity"
            onClick={() => handleCountryClick('AU')}
          >
            <title>Australia</title>
          </path>

          {/* Japan */}
          <path
            d="M 850 200 L 870 195 L 875 220 L 860 225 Z"
            fill={getColor('JP')}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-80 cursor-pointer transition-opacity"
            onClick={() => handleCountryClick('JP')}
          >
            <title>Japan</title>
          </path>

          {/* China */}
          <path
            d="M 750 180 L 820 170 L 840 210 L 820 240 L 760 230 Z"
            fill={getColor('CN')}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-80 cursor-pointer transition-opacity"
            onClick={() => handleCountryClick('CN')}
          >
            <title>China</title>
          </path>

          {/* India */}
          <path
            d="M 680 220 L 720 215 L 730 260 L 700 270 Z"
            fill={getColor('IN')}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-80 cursor-pointer transition-opacity"
            onClick={() => handleCountryClick('IN')}
          >
            <title>India</title>
          </path>

          {/* Brazil */}
          <path
            d="M 320 300 L 380 290 L 400 340 L 380 370 L 330 360 Z"
            fill={getColor('BR')}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-80 cursor-pointer transition-opacity"
            onClick={() => handleCountryClick('BR')}
          >
            <title>Brazil</title>
          </path>

          {/* Rest of the world - background */}
          <rect x="0" y="0" width="1000" height="500" fill="#F0F0F0" opacity="0.3" />
        </g>

        {/* Add text for major regions */}
        <text x="500" y="250" textAnchor="middle" className="text-xs fill-gray-400 pointer-events-none">
          Click on a country to explore
        </text>
      </svg>
    </div>
  );
}
