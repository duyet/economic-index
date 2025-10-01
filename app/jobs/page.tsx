'use client';

import { useEffect, useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { TaskWaffleChart } from '@/components/charts/TaskWaffleChart';
import { formatPercent } from '@/lib/utils/formatters';
import { SOC_MAJOR_GROUPS } from '@/lib/data/constants';

export default function JobsPage() {
  const [occupations, setOccupations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'usage' | 'name'>('usage');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState(100);

  useEffect(() => {
    fetch('/data/occupations.json')
      .then((res) => res.json())
      .then((data) => {
        setOccupations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading occupations data:', error);
        setLoading(false);
      });
  }, []);

  const processedOccupations = useMemo(() => {
    if (!occupations || occupations.length === 0) return [];

    return occupations
      .map((occ: any) => {
        return {
          ...occ,
          soc_title: SOC_MAJOR_GROUPS[occ.soc_major_group] || 'Other',
        };
      })
      .sort((a: any, b: any) => {
        if (sortBy === 'usage') {
          return (b.total_usage_pct || 0) - (a.total_usage_pct || 0);
        }
        return a.occupation_title.localeCompare(b.occupation_title);
      });
  }, [occupations, sortBy]);

  const filteredOccupations = useMemo(() => {
    return processedOccupations.filter((occ: any) => {
      const matchesSearch = searchTerm === '' ||
        occ.occupation_title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' ||
        occ.soc_major_group === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [processedOccupations, searchTerm, categoryFilter]);

  // Get unique categories from occupations
  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, string>();
    processedOccupations.forEach((occ: any) => {
      if (occ.soc_major_group && occ.soc_title) {
        uniqueCategories.set(occ.soc_major_group, occ.soc_title);
      }
    });
    return Array.from(uniqueCategories.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [processedOccupations]);

  if (loading) {
    return (
      <MainLayout>
        <div>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl">
        <h1 className="text-5xl font-serif mb-4 text-gray-900 font-light leading-tight">Explore by job</h1>
        <p className="text-gray-700 mb-6 leading-relaxed max-w-3xl">
          People use AI to automate certain parts of their jobs, like data entry. When exploring
          problems or ideas, Claude becomes a collaborative partner instead. Other tasks remain
          firmly in human hands.
        </p>

        {/* Legend */}
        <div className="mb-6 flex items-start gap-6 flex-wrap">
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
        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for a job"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'usage' | 'name')}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white min-w-[200px]"
            >
              <option value="usage">Sort By: Usage Rank</option>
              <option value="name">Sort By: Name</option>
            </select>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.slice(0, 6).map(([code, title]) => (
                <button
                  key={code}
                  onClick={() => setCategoryFilter(code)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    categoryFilter === code
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {title}
                </button>
              ))}
              {categoryFilter !== 'all' && !categories.slice(0, 6).find(([code]) => code === categoryFilter) && (
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="px-2 py-1.5 text-sm text-teal-600 hover:text-teal-700"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-600 text-center">
          {filteredOccupations.length} occupations
        </div>

        {/* Occupations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredOccupations.slice(0, displayCount).map((occ: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-md transition-all duration-150 cursor-pointer"
            >
              <div className="mb-3">
                <h3 className="font-medium text-[15px] text-gray-900 mb-1.5 line-clamp-2 min-h-[2.6rem] leading-[1.3]">
                  {occ.occupation_title}
                </h3>
                <div className="text-xs text-gray-500">
                  {occ.soc_title}
                </div>
              </div>

              {/* Task Waffle Chart */}
              <div className="mb-3">
                <TaskWaffleChart tasks={occ.tasks || []} />
              </div>

              {/* Usage Percentage */}
              <div className="text-xs text-gray-600">
                {formatPercent(occ.total_usage_pct || 0)} usage
              </div>
            </div>
          ))}
        </div>

        {filteredOccupations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No occupations found matching your criteria
          </div>
        )}

        {filteredOccupations.length > displayCount && (
          <div className="text-center mt-8">
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 100, filteredOccupations.length))}
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              Load More ({filteredOccupations.length - displayCount} remaining)
            </button>
          </div>
        )}

        {displayCount >= filteredOccupations.length && filteredOccupations.length > 100 && (
          <div className="text-center mt-8 text-sm text-gray-600">
            Showing all {filteredOccupations.length} occupations
          </div>
        )}
      </div>
    </MainLayout>
  );
}
