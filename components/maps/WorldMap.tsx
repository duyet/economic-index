'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface WorldMapProps {
  data?: Record<string, number>;
}

export default function WorldMap({ data = {} }: WorldMapProps) {
  const router = useRouter();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

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

  const countries = [
    // North America
    { code: 'US', name: 'United States', path: 'M 140 120 L 145 110 L 155 105 L 170 105 L 185 110 L 195 115 L 210 115 L 225 120 L 235 130 L 240 145 L 245 160 L 245 175 L 240 185 L 230 190 L 215 190 L 200 185 L 185 180 L 175 175 L 165 170 L 155 165 L 150 155 L 145 140 L 140 125 Z' },
    { code: 'CA', name: 'Canada', path: 'M 140 50 L 160 45 L 180 45 L 200 50 L 220 55 L 235 65 L 245 80 L 250 95 L 245 105 L 235 110 L 220 110 L 200 105 L 180 100 L 160 95 L 145 85 L 135 70 L 135 55 Z' },
    { code: 'MX', name: 'Mexico', path: 'M 145 195 L 160 190 L 175 190 L 185 195 L 195 205 L 195 215 L 185 220 L 170 220 L 155 215 L 145 205 Z' },

    // South America
    { code: 'BR', name: 'Brazil', path: 'M 290 240 L 305 235 L 320 235 L 335 245 L 345 260 L 350 280 L 345 300 L 335 315 L 320 325 L 305 325 L 290 315 L 280 300 L 275 280 L 280 260 L 285 245 Z' },
    { code: 'AR', name: 'Argentina', path: 'M 275 330 L 285 325 L 295 330 L 300 345 L 300 365 L 295 385 L 285 395 L 275 390 L 270 375 L 270 355 L 272 340 Z' },

    // Europe
    { code: 'GB', name: 'United Kingdom', path: 'M 475 105 L 482 102 L 488 105 L 490 112 L 485 118 L 478 118 L 472 113 L 472 108 Z' },
    { code: 'FR', name: 'France', path: 'M 485 125 L 495 122 L 505 125 L 510 135 L 505 145 L 495 148 L 485 145 L 480 135 Z' },
    { code: 'DE', name: 'Germany', path: 'M 510 108 L 520 105 L 530 108 L 535 118 L 530 128 L 520 130 L 510 125 L 508 115 Z' },
    { code: 'ES', name: 'Spain', path: 'M 465 145 L 478 142 L 490 145 L 495 155 L 488 162 L 475 162 L 465 157 L 463 150 Z' },
    { code: 'IT', name: 'Italy', path: 'M 515 145 L 522 142 L 528 148 L 530 158 L 525 168 L 518 170 L 513 165 L 512 155 Z' },

    // Africa
    { code: 'EG', name: 'Egypt', path: 'M 530 170 L 540 168 L 548 172 L 550 182 L 545 190 L 538 192 L 530 188 L 528 178 Z' },
    { code: 'ZA', name: 'South Africa', path: 'M 540 330 L 550 328 L 560 332 L 565 342 L 560 352 L 550 355 L 540 350 L 538 340 Z' },
    { code: 'NG', name: 'Nigeria', path: 'M 505 210 L 515 208 L 523 212 L 525 220 L 520 228 L 512 230 L 505 225 L 503 218 Z' },

    // Middle East
    { code: 'SA', name: 'Saudi Arabia', path: 'M 560 180 L 575 178 L 585 185 L 588 195 L 582 205 L 570 208 L 560 203 L 558 190 Z' },
    { code: 'AE', name: 'UAE', path: 'M 595 195 L 602 193 L 607 198 L 607 205 L 602 210 L 595 210 L 592 203 Z' },

    // Asia
    { code: 'CN', name: 'China', path: 'M 700 110 L 725 105 L 750 110 L 770 125 L 780 145 L 775 165 L 760 175 L 740 175 L 720 168 L 705 155 L 695 135 L 695 120 Z' },
    { code: 'IN', name: 'India', path: 'M 650 180 L 665 175 L 680 180 L 690 195 L 690 215 L 682 230 L 668 238 L 655 235 L 645 220 L 645 200 Z' },
    { code: 'JP', name: 'Japan', path: 'M 820 130 L 830 128 L 838 135 L 840 148 L 835 160 L 828 165 L 820 160 L 818 148 L 820 138 Z' },
    { code: 'KR', name: 'South Korea', path: 'M 800 145 L 807 143 L 812 148 L 812 156 L 807 162 L 800 162 L 797 155 Z' },
    { code: 'ID', name: 'Indonesia', path: 'M 720 245 L 750 240 L 780 245 L 795 255 L 790 265 L 770 270 L 745 268 L 720 260 Z' },
    { code: 'TH', name: 'Thailand', path: 'M 695 220 L 705 218 L 712 225 L 712 238 L 705 245 L 698 243 L 693 235 Z' },
    { code: 'VN', name: 'Vietnam', path: 'M 715 215 L 723 213 L 728 220 L 728 235 L 723 243 L 716 243 L 713 233 Z' },
    { code: 'SG', name: 'Singapore', path: 'M 710 250 L 715 249 L 717 253 L 715 257 L 710 257 L 709 253 Z' },

    // Oceania
    { code: 'AU', name: 'Australia', path: 'M 750 300 L 780 295 L 810 305 L 835 320 L 845 340 L 840 360 L 820 375 L 790 380 L 760 375 L 740 360 L 735 340 L 740 320 Z' },
    { code: 'NZ', name: 'New Zealand', path: 'M 880 360 L 890 358 L 895 368 L 895 380 L 888 388 L 880 386 L 877 375 Z' },
  ];

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-4">
      <svg
        viewBox="0 0 950 450"
        className="w-full h-auto"
        style={{ maxHeight: '450px' }}
      >
        {/* Ocean background */}
        <rect x="0" y="0" width="950" height="450" fill="#E0F2FE" />

        {/* Countries */}
        {countries.map((country) => (
          <path
            key={country.code}
            d={country.path}
            fill={getColor(country.code)}
            stroke="#ffffff"
            strokeWidth="1.5"
            className="hover:brightness-90 cursor-pointer transition-all"
            onClick={() => handleCountryClick(country.code)}
            onMouseEnter={() => setHoveredCountry(country.name)}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            <title>{country.name}</title>
          </path>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 text-sm text-gray-900 font-medium pointer-events-none">
          {hoveredCountry}
        </div>
      )}
    </div>
  );
}
