'use client';

import { useEffect, useState, useMemo } from 'react';
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
    return <div className="p-8">Loading...</div>;
  }

  // Get unique SOC codes
  const socCodes: string[] = Array.from(new Set(tasks.map((t: any) => t.soc_code as string)));

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif mb-2">Explore by Job</h1>
        <p className="text-gray-600 mb-8">
          People use AI to automate certain parts of their jobs, like data entry. When exploring
          problems or ideas, Claude becomes a collaborative partner instead. Other tasks remain
          firmly in human hands.
        </p>

        <div className="mb-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p>
            We&apos;ve grouped task data into job titles based on a standard called O*NET-SOC
            classification. Hover over the squares for a detailed breakdown.
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

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.slice(0, 100).map((task: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-teal-300 hover:shadow-md transition-all"
            >
              <div className="mb-3">
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{task.task}</h3>
                <div className="text-xs text-gray-500">{task.soc_title}</div>
              </div>

              {/* Simple visualization - waffle chart placeholder */}
              <div className="grid grid-cols-10 gap-0.5 mb-3">
                {Array.from({ length: 100 }).map((_, i) => {
                  const pct = task.metrics.onet_task_pct || 0;
                  const filled = i < Math.round(pct * 10);
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-sm"
                      style={{
                        backgroundColor: filled ? '#4DCAB6' : '#E5E7EB',
                      }}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-gray-600">
                  {formatNumber(task.metrics.onet_task_count || 0)} uses
                </span>
                <span className="font-medium">
                  {formatPercent(task.metrics.onet_task_pct || 0)} usage
                </span>
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
          <div className="text-center mt-6 text-sm text-gray-600">
            Showing first 100 of {filteredTasks.length} tasks
          </div>
        )}
      </div>
    </div>
  );
}
