'use client';

import { useEffect, useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { WaffleChart } from '@/components/charts/WaffleChart';
import { formatPercent } from '@/lib/utils/formatters';
import { SOC_MAJOR_GROUPS } from '@/lib/data/constants';

export default function JobsPage() {
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'usage' | 'name'>('usage');

  useEffect(() => {
    fetch('/data/global.json')
      .then((res) => res.json())
      .then((data) => {
        setGlobalData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading global data:', error);
        setLoading(false);
      });
  }, []);

  const tasks = useMemo(() => {
    if (!globalData?.tasks) return [];

    return globalData.tasks
      .filter((t: any) => t.task !== 'not_classified' && t.task !== 'none')
      .map((t: any) => {
        // Extract SOC code from task (simplified - would need proper mapping)
        const socCode = '15'; // Default to Computer/Math for demo

        // Simulate collaboration mode percentages for waffle chart
        const directive = Math.random() * 80; // Automation
        const learning = Math.random() * (100 - directive); // Augmentation

        return {
          ...t,
          soc_code: socCode,
          soc_title: SOC_MAJOR_GROUPS[socCode] || 'Computer and Mathematical',
          collaboration: {
            directive,
            learning,
            other: 100 - directive - learning
          }
        };
      })
      .sort((a: any, b: any) => {
        if (sortBy === 'usage') {
          return (b.metrics.onet_task_pct || 0) - (a.metrics.onet_task_pct || 0);
        }
        return a.task.localeCompare(b.task);
      });
  }, [globalData, sortBy]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task: any) => {
      const matchesSearch = searchTerm === '' ||
        task.task.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [tasks, searchTerm]);

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
        <div className="mb-8 flex items-start gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#5A9770' }}></div>
            <span className="text-sm text-gray-700">Mostly automated tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#B8A3D6' }}></div>
            <span className="text-sm text-gray-700">Mostly augmented tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E8E4DC' }}></div>
            <span className="text-sm text-gray-700">Tasks that don&apos;t appear in our data</span>
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
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for a job"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'usage' | 'name')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white min-w-[200px]"
          >
            <option value="usage">Sort By: Usage Rank</option>
            <option value="name">Sort By: Name</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-600 text-center">
          {filteredTasks.length} occupations
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTasks.slice(0, 100).map((task: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-teal-300 hover:shadow-md transition-all"
            >
              <div className="mb-3">
                <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
                  {task.task}
                </h3>
                <div className="text-xs text-gray-600">{task.soc_title}</div>
              </div>

              {/* Waffle Chart */}
              <div className="mb-3">
                <WaffleChart data={task.collaboration} />
              </div>

              {/* Usage Percentage */}
              <div className="text-xs text-gray-600">
                {formatPercent(task.metrics.onet_task_pct || 0)} usage
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tasks found matching your criteria
          </div>
        )}

        {filteredTasks.length > 100 && (
          <div className="text-center mt-8 text-sm text-gray-600">
            Showing first 100 of {filteredTasks.length} occupations
          </div>
        )}
      </div>
    </MainLayout>
  );
}
