'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface CountryData {
  geo_id: string;
  geography: string;
  metrics: {
    usage_count: number;
    usage_pct: number;
    usage_tier?: number;
  };
  collaboration: Array<{
    mode: string;
    metrics: {
      collaboration_count: number;
      collaboration_pct: number;
    };
  }>;
  tasks: Array<{
    task: string;
    metrics: {
      onet_task_count: number;
      onet_task_pct: number;
    };
  }>;
}

type ViewMode = 'usage' | 'collaboration' | 'industries';

interface WorldMapProps {
  data?: Record<string, number>;
  showTabs?: boolean;
}

export default function WorldMap({ data, showTabs = true }: WorldMapProps) {
  const router = useRouter();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<Record<string, CountryData>>({});
  const [svgContent, setSvgContent] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('usage');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load country data from JSON
    fetch('/data/countries.json')
      .then((res) => res.json())
      .then((countries: CountryData[]) => {
        const dataMap: Record<string, CountryData> = {};
        countries.forEach((country) => {
          dataMap[country.geo_id] = country;
        });
        setCountryData(dataMap);
      })
      .catch((err) => console.error('Failed to load country data:', err));

    // Load SVG
    fetch('/maps/world.svg')
      .then((res) => res.text())
      .then((svg) => setSvgContent(svg))
      .catch((err) => console.error('Failed to load SVG:', err));
  }, []);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const container = containerRef.current;
    const svgElement = container.querySelector('svg');
    if (!svgElement) return;

    // Style the SVG for responsive sizing
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', 'auto');
    svgElement.style.maxHeight = '500px';
    svgElement.style.display = 'block';
    svgElement.style.overflow = 'visible';

    // Get all country paths
    const paths = svgElement.querySelectorAll('path[id]');

    // Mouse move handler for tooltip positioning
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    paths.forEach((path) => {
      const countryCode = path.getAttribute('id');
      if (!countryCode) return;

      // Set color based on tier
      const color = getColor(countryCode);
      path.setAttribute('fill', color);
      path.setAttribute('stroke', '#ffffff');
      path.setAttribute('stroke-width', '0.3');
      path.setAttribute('cursor', 'pointer');

      // Add hover and click handlers
      path.addEventListener('mouseenter', () => setHoveredCountry(countryCode));
      path.addEventListener('mouseleave', () => setHoveredCountry(null));
      path.addEventListener('click', () => handleCountryClick(countryCode));

      // Add hover effect
      path.addEventListener('mouseenter', function() {
        this.setAttribute('opacity', '0.8');
      });
      path.addEventListener('mouseleave', function() {
        this.setAttribute('opacity', '1');
      });
    });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      paths.forEach((path) => {
        const newPath = path.cloneNode(true);
        path.parentNode?.replaceChild(newPath, path);
      });
    };
  }, [svgContent, countryData, viewMode]);

  // Task categories mapping
  const getTaskCategory = (task: string): string => {
    const lowerTask = task.toLowerCase();
    if (lowerTask.includes('computer') || lowerTask.includes('software') || lowerTask.includes('program')) return 'computer';
    if (lowerTask.includes('design') || lowerTask.includes('art') || lowerTask.includes('creative')) return 'arts';
    if (lowerTask.includes('teach') || lowerTask.includes('student') || lowerTask.includes('education')) return 'education';
    if (lowerTask.includes('office') || lowerTask.includes('administrative')) return 'office';
    if (lowerTask.includes('business') || lowerTask.includes('management')) return 'business';
    return 'other';
  };

  const getCollaborationData = (countryCode: string): { automation: number; augmentation: number } => {
    const country = countryData[countryCode];
    if (!country || !country.collaboration) return { automation: 0, augmentation: 0 };

    let automation = 0;
    let augmentation = 0;

    country.collaboration.forEach((collab) => {
      const mode = collab.mode.toLowerCase();
      if (mode.includes('directive') || mode.includes('feedback loop')) {
        automation += collab.metrics.collaboration_pct;
      } else if (mode.includes('learning') || mode.includes('task iteration') || mode.includes('validation')) {
        augmentation += collab.metrics.collaboration_pct;
      }
    });

    return { automation, augmentation };
  };

  const getTopIndustry = (countryCode: string): string => {
    const country = countryData[countryCode];
    if (!country || !country.tasks || country.tasks.length === 0) return 'none';

    const categoryCounts: Record<string, number> = {
      computer: 0,
      arts: 0,
      education: 0,
      office: 0,
      business: 0,
      other: 0,
    };

    country.tasks.forEach((task) => {
      const category = getTaskCategory(task.task);
      categoryCounts[category] += task.metrics.onet_task_pct;
    });

    const topCategory = Object.entries(categoryCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    return topCategory;
  };

  const getColor = (countryCode: string) => {
    // If custom data provided, use it
    if (data && data[countryCode] !== undefined) {
      const value = data[countryCode];
      if (value >= 4) return '#117763'; // Leading
      if (value >= 3) return '#4DCAB6'; // Upper middle
      if (value >= 2) return '#80D9CB'; // Lower middle
      if (value >= 1) return '#B3E8E0'; // Emerging
      return '#E6F7F5'; // Minimal
    }

    const country = countryData[countryCode];
    if (!country) return '#E5E7EB'; // Gray for no data

    // Usage tier view
    if (viewMode === 'usage') {
      const tier = country.metrics.usage_tier;
      if (tier === 4) return '#117763'; // Leading
      if (tier === 3) return '#4DCAB6'; // Upper middle
      if (tier === 2) return '#80D9CB'; // Lower middle
      if (tier === 1) return '#B3E8E0'; // Emerging
      return '#E6F7F5'; // Minimal
    }

    // Collaboration view
    if (viewMode === 'collaboration') {
      const { automation, augmentation } = getCollaborationData(countryCode);
      if (automation === 0 && augmentation === 0) return '#E5E7EB'; // No data

      // Determine dominant mode
      if (automation > augmentation) {
        return '#B4A7D6'; // Purple for automation
      } else {
        return '#A8C5A0'; // Sage green for augmentation
      }
    }

    // Industries view
    if (viewMode === 'industries') {
      const topIndustry = getTopIndustry(countryCode);
      const industryColors: Record<string, string> = {
        computer: '#D4C5A0', // Beige
        arts: '#F98D7F', // Coral
        education: '#6B8DD6', // Blue
        office: '#9CA3AF', // Gray
        business: '#96C1A2', // Sage
        other: '#E5E7EB', // Light gray
        none: '#E5E7EB',
      };
      return industryColors[topIndustry] || '#E5E7EB';
    }

    return '#E5E7EB';
  };

  const getCountryInfo = (countryCode: string) => {
    const country = countryData[countryCode];
    if (!country) return null;

    const tierNames = ['Minimal', 'Emerging', 'Lower Middle', 'Upper Middle', 'Leading'];
    const tier = country.metrics.usage_tier || 0;

    // Base info
    const info: any = {
      name: countryCode,
      usageCount: country.metrics.usage_count.toLocaleString(),
      usagePct: (country.metrics.usage_pct * 100).toFixed(2),
      tier: tierNames[tier],
    };

    // Add collaboration breakdown if in collaboration mode
    if (viewMode === 'collaboration') {
      const { automation, augmentation } = getCollaborationData(countryCode);
      info.automation = automation.toFixed(1);
      info.augmentation = augmentation.toFixed(1);
      info.dominant = automation > augmentation ? 'Automation' : 'Augmentation';
    }

    // Add industry breakdown if in industries mode
    if (viewMode === 'industries') {
      const topIndustry = getTopIndustry(countryCode);
      const industryNames: Record<string, string> = {
        computer: 'Computer & mathematical',
        arts: 'Arts & entertainment',
        education: 'Educational instruction',
        office: 'Office & administrative',
        business: 'Business & management',
        other: 'Other',
        none: 'No data',
      };
      info.topIndustry = industryNames[topIndustry];

      // Get task count for this industry
      if (country.tasks && country.tasks.length > 0) {
        const taskCount = country.tasks.filter(t => getTaskCategory(t.task) === topIndustry).length;
        info.taskCount = taskCount;
      }
    }

    return info;
  };

  const handleCountryClick = (countryCode: string) => {
    router.push(`/country/${countryCode.toLowerCase()}`);
  };

  const renderLegend = () => {
    if (viewMode === 'usage') {
      return (
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#117763' }}></div>
            <span>Leading</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4DCAB6' }}></div>
            <span>Upper Middle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#80D9CB' }}></div>
            <span>Lower Middle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#B3E8E0' }}></div>
            <span>Emerging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E6F7F5' }}></div>
            <span>Minimal</span>
          </div>
        </div>
      );
    }

    if (viewMode === 'collaboration') {
      return (
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#A8C5A0' }}></div>
            <span>Augmentation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#B4A7D6' }}></div>
            <span>Automation</span>
          </div>
        </div>
      );
    }

    if (viewMode === 'industries') {
      return (
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D4C5A0' }}></div>
            <span>Computer and mathematical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F98D7F' }}></div>
            <span>Arts, design, entertainment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6B8DD6' }}></div>
            <span>Educational instruction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9CA3AF' }}></div>
            <span>Office and administrative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#96C1A2' }}></div>
            <span>Business and management</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full">
      {/* Tabs */}
      {showTabs && (
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setViewMode('usage')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'usage'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usage Index
            </button>
            <button
              onClick={() => setViewMode('collaboration')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'collaboration'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Augmentation vs. automation
            </button>
            <button
              onClick={() => setViewMode('industries')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'industries'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Top industries
            </button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full" style={{ maxHeight: '500px', overflow: 'hidden' }}>
        <div
          ref={containerRef}
          className="w-full"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Enhanced Tooltip */}
        {hoveredCountry && (
          <div
            className="absolute bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-200 pointer-events-none z-50 max-w-xs"
            style={{
              left: `${mousePos.x + 15}px`,
              top: `${mousePos.y - 10}px`,
              transform: mousePos.x > 600 ? 'translateX(-100%) translateX(-20px)' : 'none'
            }}
          >
            {(() => {
              const info = getCountryInfo(hoveredCountry);

              return (
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900 border-b border-gray-100 pb-2">
                    {hoveredCountry}
                  </div>
                  {info && (
                    <>
                      {/* Usage Index View */}
                      {viewMode === 'usage' && (
                        <>
                          <div className="text-xs text-gray-600">
                            <span className="text-gray-500">Tier:</span>{' '}
                            <span className="font-medium text-teal-700">{info.tier}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="text-gray-500">Usage:</span>{' '}
                            <span className="font-medium">{info.usageCount}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="text-gray-500">Percentage:</span>{' '}
                            <span className="font-medium">{info.usagePct}%</span>
                          </div>
                        </>
                      )}

                      {/* Collaboration View */}
                      {viewMode === 'collaboration' && (
                        <>
                          <div className="text-xs text-gray-600">
                            <span className="text-gray-500">Dominant:</span>{' '}
                            <span className="font-medium text-purple-700">{info.dominant}</span>
                          </div>
                          <div className="pt-1 space-y-1">
                            <div className="text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#A8C5A0' }}></div>
                                <span className="text-gray-500">Augmentation:</span>
                                <span className="font-medium">{info.augmentation}%</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#B4A7D6' }}></div>
                                <span className="text-gray-500">Automation:</span>
                                <span className="font-medium">{info.automation}%</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Industries View */}
                      {viewMode === 'industries' && (
                        <>
                          <div className="text-xs text-gray-600">
                            <span className="text-gray-500">Top Industry:</span>{' '}
                            <span className="font-medium text-blue-700">{info.topIndustry}</span>
                          </div>
                          {info.taskCount && (
                            <div className="text-xs text-gray-600">
                              <span className="text-gray-500">Tasks:</span>{' '}
                              <span className="font-medium">{info.taskCount}</span>
                            </div>
                          )}
                        </>
                      )}

                      <div className="text-xs text-gray-400 italic pt-1 border-t border-gray-100 mt-2">
                        Click to view details
                      </div>
                    </>
                  )}
                  {!info && (
                    <div className="text-xs text-gray-500 italic">No data available</div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Legend */}
      {renderLegend()}
    </div>
  );
}
