'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { List, ListImperativeAPI } from 'react-window';
import type { ReactElement } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { formatPercent } from '@/lib/utils/formatters';
import { sanitizeInput } from '@/lib/utils/sanitize';
import { SOC_MAJOR_GROUPS } from '@/lib/data/constants';
import { DataErrorBoundary } from '@/components/errors';
import { WaffleChartSkeleton } from '@/components/ui/skeletons';
import { useOccupations } from '@/lib/hooks';

// Lazy load TaskWaffleChart component for code splitting
const TaskWaffleChart = dynamic(
  () => import('@/components/charts/TaskWaffleChart').then((mod) => ({ default: mod.TaskWaffleChart })),
  {
    loading: () => <WaffleChartSkeleton size={12} />,
  }
);

// Constants for virtualization
const CARD_HEIGHT = 240; // Height of each occupation card in pixels
const CARD_GAP = 16; // Gap between cards (gap-4 = 16px)
const ROW_HEIGHT = CARD_HEIGHT + CARD_GAP; // Total row height including gap

// Calculate number of columns based on container width
const getColumnCount = (width: number): number => {
  if (width >= 1536) return 5; // 2xl
  if (width >= 1280) return 4; // xl
  if (width >= 1024) return 3; // lg
  if (width >= 640) return 2; // sm
  return 1; // default
};

export default function JobsPage() {
  const { occupations, isLoading, isError } = useOccupations();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'usage' | 'name'>('usage');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [containerWidth, setContainerWidth] = useState(1200);
  const [containerHeight, setContainerHeight] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<ListImperativeAPI>(null);

  const processedOccupations = useMemo(() => {
    if (!occupations || occupations.length === 0) return [];

    return occupations
      .map((occ) => {
        return {
          ...occ,
          soc_title: SOC_MAJOR_GROUPS[occ.soc_major_group] || 'Other',
        };
      })
      .sort((a, b) => {
        if (sortBy === 'usage') {
          return (b.usage_pct || 0) - (a.usage_pct || 0);
        }
        return a.occupation_title.localeCompare(b.occupation_title);
      });
  }, [occupations, sortBy]);

  const filteredOccupations = useMemo(() => {
    // Sanitize search input for safe filtering
    const sanitizedSearchTerm = sanitizeInput(searchTerm);

    return processedOccupations.filter((occ) => {
      const matchesSearch = sanitizedSearchTerm === '' ||
        occ.occupation_title.toLowerCase().includes(sanitizedSearchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' ||
        occ.soc_major_group === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [processedOccupations, searchTerm, categoryFilter]);

  // Get unique categories from occupations
  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, string>();
    processedOccupations.forEach((occ) => {
      if (occ.soc_major_group && occ.soc_major_group_title) {
        uniqueCategories.set(occ.soc_major_group, occ.soc_major_group_title);
      }
    });
    return Array.from(uniqueCategories.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [processedOccupations]);

  // Calculate columns based on container width
  const columnCount = useMemo(() => getColumnCount(containerWidth), [containerWidth]);

  // Calculate number of rows needed
  const rowCount = useMemo(() => {
    return Math.ceil(filteredOccupations.length / columnCount);
  }, [filteredOccupations.length, columnCount]);

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
        setContainerHeight(Math.min(window.innerHeight - 400, 800)); // Max height, accounting for header
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Small delay to ensure layout is settled
    const timeoutId = setTimeout(updateDimensions, 100);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timeoutId);
    };
  }, []);

  // Reset list scroll position when filters change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToRow({ index: 0, behavior: 'auto' });
    }
  }, [searchTerm, categoryFilter, sortBy]);

  // Row renderer for virtualized list (using object instead of Record for better compatibility)
  type RowPropsType = object;

  const RowComponent = ({ index, style }: { index: number; style: React.CSSProperties }): ReactElement => {
    const startIndex = index * columnCount;
    const rowOccupations = filteredOccupations.slice(startIndex, startIndex + columnCount);

    return (
      <div style={style} className="px-2">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          }}
        >
          {rowOccupations.map((occ, colIndex) => {
            const occIndex = startIndex + colIndex;
            return (
              <article
                key={occIndex}
                className="group relative bg-white rounded-xl border border-gray-100 p-5 shadow-soft hover:shadow-soft-lg hover:border-teal-200 hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer overflow-hidden"
                role="listitem"
                aria-label={`${occ.occupation_title}, ${formatPercent(occ.usage_pct || 0)} usage`}
                style={{ height: `${CARD_HEIGHT}px` }}
              >
                {/* Header */}
                <div className="mb-3">
                  <h3 className="font-semibold text-[15px] text-gray-900 mb-2 line-clamp-2 min-h-[2.6rem] leading-[1.3] group-hover:text-teal-700 transition-colors">
                    {occ.occupation_title}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 group-hover:bg-teal-50 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span className="text-xs font-medium text-gray-600 group-hover:text-teal-700">
                      {SOC_MAJOR_GROUPS[occ.soc_major_group] || 'Other'}
                    </span>
                  </div>
                </div>

                {/* Task Waffle Chart */}
                <div className="mb-3 bg-gray-50 rounded-lg p-2 group-hover:bg-teal-50/30 transition-colors">
                  <DataErrorBoundary componentName="Task Chart">
                    <TaskWaffleChart
                      tasks={(occ.tasks || []).map((t) => ({
                        task: t.task,
                        metrics: {
                          onet_task_count: 0,
                          onet_task_pct: t.usage_pct,
                        },
                      }))}
                    />
                  </DataErrorBoundary>
                </div>

                {/* Usage Percentage */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Usage</span>
                  <span className="text-sm font-bold text-teal-600">
                    {formatPercent(occ.usage_pct || 0)}
                  </span>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" />
              </article>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl">
          <header className="mb-8">
            <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse mb-4" />
            <div className="h-6 w-full max-w-3xl bg-gray-200 rounded animate-pulse" />
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-soft animate-scale-in"
                style={{ animationDelay: `${i * 50}ms`, height: '240px' }}
              >
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-32 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !occupations) {
    return (
      <MainLayout>
        <div className="max-w-7xl">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">Error loading occupations data</h2>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl">
        <header className="mb-6">
          <h1 className="text-5xl font-serif mb-4 text-gray-900 font-light leading-tight">Explore by job</h1>
          <p className="text-gray-700 leading-relaxed max-w-3xl">
            People use AI to automate certain parts of their jobs, like data entry. When exploring
            problems or ideas, Claude becomes a collaborative partner instead. Other tasks remain
            firmly in human hands.
          </p>
        </header>

        {/* Legend */}
        <div className="mb-6 flex items-start gap-6 flex-wrap" role="img" aria-label="Task automation legend">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5A9770' }}></div>
            <span className="text-sm text-gray-600">Mostly automated tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#B8A3D6' }}></div>
            <span className="text-sm text-gray-600">Mostly augmented tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E8E4DC' }}></div>
            <span className="text-sm text-gray-600">Tasks that don&apos;t appear in our data</span>
          </div>
        </div>

        <div className="mb-6 text-sm text-gray-600 bg-cream-50 p-4 rounded-lg border border-gray-200 flex items-start gap-2">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>
            We&apos;ve grouped task data into job titles based on a standard called O*NET-SOC
            classification. Hover over the squares for a detailed breakdown.
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-5 mb-8" role="search" aria-label="Search and filter jobs">
          <div className="flex gap-4">
            <div className="flex-1 relative group">
              <label htmlFor="job-search" className="sr-only">Search for a job</label>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="job-search"
                type="text"
                placeholder="Search for a job by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl bg-white shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:shadow-glow-teal transition-all duration-300"
                aria-label="Search for a job by title"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <label htmlFor="sort-jobs" className="sr-only">Sort jobs</label>
            <select
              id="sort-jobs"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'usage' | 'name')}
              className="px-6 py-3 border border-gray-200 rounded-xl bg-white shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:shadow-glow-teal transition-all duration-300 font-medium text-gray-700 min-w-[220px]"
              aria-label="Sort jobs by"
            >
              <option value="usage">Sort By: Usage Rank</option>
              <option value="name">Sort By: Name</option>
            </select>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2.5 flex-wrap" role="group" aria-label="Filter by job category">
              <span className="text-sm font-semibold text-gray-700 mr-1" id="category-label">Category:</span>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  categoryFilter === 'all'
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-glow-teal scale-105'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50 shadow-soft'
                }`}
                aria-pressed={categoryFilter === 'all'}
                aria-label="Show all categories"
              >
                All
              </button>
              {categories.slice(0, 6).map(([code, title]) => (
                <button
                  key={code}
                  onClick={() => setCategoryFilter(code)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    categoryFilter === code
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-glow-teal scale-105'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50 shadow-soft'
                  }`}
                  aria-pressed={categoryFilter === code}
                  aria-label={`Filter by ${title}`}
                >
                  {title}
                </button>
              ))}
              {categoryFilter !== 'all' && !categories.slice(0, 6).find(([code]) => code === categoryFilter) && (
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-full transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-600 flex items-center justify-center gap-2" role="status" aria-live="polite">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="font-medium">
            {filteredOccupations.length} {filteredOccupations.length === 1 ? 'occupation' : 'occupations'}
          </span>
          {(searchTerm || categoryFilter !== 'all') && (
            <span className="text-gray-500">
              found
            </span>
          )}
        </div>

        {/* Virtualized Occupations List */}
        {filteredOccupations.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-light text-gray-900 mb-2">No occupations found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <div className="flex items-center justify-center gap-3">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-soft hover:shadow-soft-lg transition-all duration-300 font-medium"
                >
                  Clear search
                </button>
              )}
              {categoryFilter !== 'all' && (
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-teal-300 hover:bg-teal-50 shadow-soft transition-all duration-300 font-medium"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        ) : (
          <div ref={containerRef} role="list" aria-label="Job occupations">
            <List<RowPropsType>
              listRef={listRef}
              rowComponent={RowComponent}
              rowCount={rowCount}
              rowHeight={ROW_HEIGHT}
              rowProps={{} as RowPropsType}
              overscanCount={2}
              className="scrollbar-thin"
              style={{ height: `${containerHeight}px`, width: '100%' }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
