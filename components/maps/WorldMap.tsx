'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useCountries } from '@/lib/hooks';

interface CountryData {
  geo_id: string;
  geography: string;
  metrics: {
    usage_count: number;
    usage_pct: number;
    usage_tier?: number;
  };
  collaboration?: Array<{
    mode: string;
    category?: string;
    metrics: {
      collaboration_count: number;
      collaboration_pct: number;
      collaboration_pct_index?: number;
    };
  }>;
  tasks?: Array<{
    task: string;
    soc_major_group?: string;
    soc_major_group_title?: string;
    metrics: {
      onet_task_count: number;
      onet_task_pct: number;
      onet_task_pct_index?: number;
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

  // Use SWR hook for countries data (cached and shared across components)
  const { countries } = useCountries();

  // Transform countries array to map once data is loaded
  useEffect(() => {
    if (countries) {
      const dataMap: Record<string, CountryData> = {};
      countries.forEach((country) => {
        dataMap[country.geo_id] = country;
      });
      setCountryData(dataMap);
    }
  }, [countries]);

  useEffect(() => {
    // Load SVG and sanitize to prevent XSS attacks
    fetch('/maps/world.svg')
      .then((res) => res.text())
      .then((svg) => {
        // Sanitize SVG to remove any potentially malicious scripts
        const sanitized = DOMPurify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
          ADD_TAGS: ['svg', 'path', 'g', 'defs', 'clipPath'],
        });
        setSvgContent(sanitized);
      })
      .catch(() => {
        // Failed to load SVG - map will not render
      });
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

    // Store event handlers for proper cleanup
    const pathHandlers = new Map<Element, {
      mouseenter: () => void;
      mouseleave: () => void;
      click: () => void;
      keydown: (e: Event) => void;
      focus: () => void;
      blur: () => void;
      mouseenterOpacity: (this: SVGPathElement) => void;
      mouseleaveOpacity: (this: SVGPathElement) => void;
    }>();

    paths.forEach((path) => {
      const countryCode = path.getAttribute('id');
      if (!countryCode) return;

      // Set color based on tier
      const color = getColor(countryCode);
      path.setAttribute('fill', color);
      path.setAttribute('stroke', '#ffffff');
      path.setAttribute('stroke-width', '0.3');
      path.setAttribute('cursor', 'pointer');

      // Make keyboard accessible
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', `View details for ${countryCode}`);

      // Create handler functions
      const handleMouseEnter = () => setHoveredCountry(countryCode);
      const handleMouseLeave = () => setHoveredCountry(null);
      const handleClick = () => handleCountryClick(countryCode);
      const handleKeyDown = (e: Event) => {
        const keyEvent = e as unknown as KeyboardEvent;
        if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
          keyEvent.preventDefault();
          handleCountryClick(countryCode);
        }
      };
      const handleFocus = () => setHoveredCountry(countryCode);
      const handleBlur = () => setHoveredCountry(null);
      const handleMouseEnterOpacity = function(this: SVGPathElement) {
        this.setAttribute('opacity', '0.8');
      };
      const handleMouseLeaveOpacity = function(this: SVGPathElement) {
        this.setAttribute('opacity', '1');
      };

      // Store handlers for cleanup
      pathHandlers.set(path, {
        mouseenter: handleMouseEnter,
        mouseleave: handleMouseLeave,
        click: handleClick,
        keydown: handleKeyDown,
        focus: handleFocus,
        blur: handleBlur,
        mouseenterOpacity: handleMouseEnterOpacity,
        mouseleaveOpacity: handleMouseLeaveOpacity,
      });

      // Add event listeners
      path.addEventListener('mouseenter', handleMouseEnter);
      path.addEventListener('mouseleave', handleMouseLeave);
      path.addEventListener('click', handleClick);
      path.addEventListener('keydown', handleKeyDown);
      path.addEventListener('focus', handleFocus);
      path.addEventListener('blur', handleBlur);
      path.addEventListener('mouseenter', handleMouseEnterOpacity);
      path.addEventListener('mouseleave', handleMouseLeaveOpacity);
    });

    // Proper cleanup function
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);

      // Remove all event listeners from paths
      pathHandlers.forEach((handlers, path) => {
        path.removeEventListener('mouseenter', handlers.mouseenter);
        path.removeEventListener('mouseleave', handlers.mouseleave);
        path.removeEventListener('click', handlers.click);
        path.removeEventListener('keydown', handlers.keydown);
        path.removeEventListener('focus', handlers.focus);
        path.removeEventListener('blur', handlers.blur);
        path.removeEventListener('mouseenter', handlers.mouseenterOpacity);
        path.removeEventListener('mouseleave', handlers.mouseleaveOpacity);
      });

      pathHandlers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400" role="img" aria-label="Usage tier legend">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#117763' }} aria-hidden="true"></div>
            <span>Leading</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4DCAB6' }} aria-hidden="true"></div>
            <span>Upper Middle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#80D9CB' }} aria-hidden="true"></div>
            <span>Lower Middle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#B3E8E0' }} aria-hidden="true"></div>
            <span>Emerging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E6F7F5' }} aria-hidden="true"></div>
            <span>Minimal</span>
          </div>
        </div>
      );
    }

    if (viewMode === 'collaboration') {
      return (
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400" role="img" aria-label="Collaboration mode legend">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#A8C5A0' }} aria-hidden="true"></div>
            <span>Augmentation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#B4A7D6' }} aria-hidden="true"></div>
            <span>Automation</span>
          </div>
        </div>
      );
    }

    if (viewMode === 'industries') {
      return (
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 flex-wrap" role="img" aria-label="Industry category legend">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D4C5A0' }} aria-hidden="true"></div>
            <span>Computer and mathematical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F98D7F' }} aria-hidden="true"></div>
            <span>Arts, design, entertainment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6B8DD6' }} aria-hidden="true"></div>
            <span>Educational instruction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9CA3AF' }} aria-hidden="true"></div>
            <span>Office and administrative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#96C1A2' }} aria-hidden="true"></div>
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
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="Map view modes">
          <div className="flex gap-8">
            <button
              onClick={() => setViewMode('usage')}
              role="tab"
              aria-selected={viewMode === 'usage'}
              aria-controls="world-map-view"
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'usage'
                  ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Usage Index
            </button>
            <button
              onClick={() => setViewMode('collaboration')}
              role="tab"
              aria-selected={viewMode === 'collaboration'}
              aria-controls="world-map-view"
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'collaboration'
                  ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Augmentation vs. automation
            </button>
            <button
              onClick={() => setViewMode('industries')}
              role="tab"
              aria-selected={viewMode === 'industries'}
              aria-controls="world-map-view"
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                viewMode === 'industries'
                  ? 'border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Top industries
            </button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        id="world-map-view"
        role="tabpanel"
        aria-label={`World map showing ${viewMode === 'usage' ? 'usage index' : viewMode === 'collaboration' ? 'collaboration modes' : 'industry distribution'}`}
        className="relative w-full"
        style={{ maxHeight: '500px', overflow: 'hidden' }}
      >
        <div
          ref={containerRef}
          className="w-full"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Enhanced Tooltip */}
        {hoveredCountry && (
          <div
            role="tooltip"
            aria-live="polite"
            className="absolute bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 pointer-events-none z-50 max-w-xs"
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
                  <div className="font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">
                    {hoveredCountry}
                  </div>
                  {info && (
                    <>
                      {/* Usage Index View */}
                      {viewMode === 'usage' && (
                        <>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="text-gray-500 dark:text-gray-400">Tier:</span>{' '}
                            <span className="font-medium text-teal-700 dark:text-teal-400">{info.tier}</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="text-gray-500 dark:text-gray-400">Usage:</span>{' '}
                            <span className="font-medium">{info.usageCount}</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="text-gray-500 dark:text-gray-400">Percentage:</span>{' '}
                            <span className="font-medium">{info.usagePct}%</span>
                          </div>
                        </>
                      )}

                      {/* Collaboration View */}
                      {viewMode === 'collaboration' && (
                        <>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="text-gray-500 dark:text-gray-400">Dominant:</span>{' '}
                            <span className="font-medium text-purple-700 dark:text-purple-400">{info.dominant}</span>
                          </div>
                          <div className="pt-1 space-y-1">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#A8C5A0' }}></div>
                                <span className="text-gray-500 dark:text-gray-400">Augmentation:</span>
                                <span className="font-medium">{info.augmentation}%</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#B4A7D6' }}></div>
                                <span className="text-gray-500 dark:text-gray-400">Automation:</span>
                                <span className="font-medium">{info.automation}%</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Industries View */}
                      {viewMode === 'industries' && (
                        <>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="text-gray-500 dark:text-gray-400">Top Industry:</span>{' '}
                            <span className="font-medium text-blue-700 dark:text-blue-400">{info.topIndustry}</span>
                          </div>
                          {info.taskCount && (
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              <span className="text-gray-500 dark:text-gray-400">Tasks:</span>{' '}
                              <span className="font-medium">{info.taskCount}</span>
                            </div>
                          )}
                        </>
                      )}

                      <div className="text-xs text-gray-400 dark:text-gray-500 italic pt-1 border-t border-gray-100 dark:border-gray-700 mt-2">
                        Click to view details
                      </div>
                    </>
                  )}
                  {!info && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 italic">No data available</div>
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
