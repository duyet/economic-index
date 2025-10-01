'use client';

import { useEffect, useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { formatNumber, formatPercent } from '@/lib/utils/formatters';
import { SOC_MAJOR_GROUPS } from '@/lib/data/constants';

export default function JobsPage() {
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSOC, setSelectedSOC] = useState<string>('all');

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
        return {
          ...t,
          soc_code: socCode,
          soc_title: SOC_MAJOR_GROUPS[socCode] || 'Other',
        };
      })
      .sort((a: any, b: any) => (b.metrics.onet_task_pct || 0) - (a.metrics.onet_task_pct || 0));
  }, [globalData]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task: any) => {
      const matchesSearch = searchTerm === '' ||
        task.task.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSOC = selectedSOC === 'all' || task.soc_code === selectedSOC;
      return matchesSearch && matchesSOC;
    });
  }, [tasks, searchTerm, selectedSOC]);

  if (loading) {
    return (
      <MainLayout>
        <div>Loading...</div>
      </MainLayout>
    );
  }

  // Get unique SOC codes
  const socCodes: string[] = Array.from(new Set(tasks.map((t: any) => t.soc_code as string)));

  return (
    <MainLayout>
      <div className="max-w-6xl">
        <h1 className="text-5xl font-serif mb-4 text-gray-900 font-light leading-tight">Explore by Job</h1>
        <p className="text-gray-700 mb-6 leading-relaxed">
          People use AI to automate certain parts of their jobs, like data entry. When exploring
          problems or ideas, Claude becomes a collaborative partner instead. Other tasks remain
          firmly in human hands.
        </p>

        <div className="mb-8 text-sm text-gray-700 bg-cream-50 p-6 rounded-lg border border-gray-200">
          <p>
            We&apos;ve grouped task data into job titles based on a standard called O*NET-SOC
            classification. Explore the data below for detailed breakdowns.
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search for a job..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select
            value={selectedSOC}
            onChange={(e) => setSelectedSOC(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[250px]"
          >
            <option value="all">All Occupations</option>
            {socCodes.map((code: string) => (
              <option key={code} value={code}>
                {SOC_MAJOR_GROUPS[code] || code}
              </option>
            ))}
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>Sort By: Usage Rank</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {filteredTasks.length} occupation{filteredTasks.length !== 1 ? 's' : ''}
        </div>

        {/* Task Grid - Compact Design */}
        <div className="space-y-2">
          {filteredTasks.slice(0, 100).map((task: any, index: number) => {
            const pct = task.metrics.onet_task_pct || 0;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-teal-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 mb-0.5 truncate">{task.task}</h3>
                    <div className="text-xs text-gray-600">{task.soc_title}</div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-48 flex-shrink-0">
                    <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(pct * 100, 0)}%` }}
                      >
                        {pct > 0.15 && (
                          <span className="text-xs font-medium text-white">
                            {formatPercent(pct)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0 w-24">
                    <div className="text-sm font-medium text-gray-900">
                      {formatNumber(task.metrics.onet_task_count || 0)}
                    </div>
                    <div className="text-xs text-gray-600">uses</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tasks found matching your criteria
          </div>
        )}

        {filteredTasks.length > 100 && (
          <div className="text-center mt-6 text-sm text-gray-600">
            Showing first 100 of {filteredTasks.length} tasks
          </div>
        )}
      </div>
    </MainLayout>
  );
}
