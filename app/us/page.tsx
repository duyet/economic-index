'use client';

import { useEffect, useState } from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { formatIndex, formatNumber } from '@/lib/utils/formatters';

export default function USPage() {
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/states.json')
      .then((res) => res.json())
      .then((data) => {
        setStates(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading states:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  // Calculate top states by usage
  const topStates = [...states]
    .filter((s) => s.metrics.usage_per_capita_index)
    .sort((a, b) => b.metrics.usage_per_capita_index - a.metrics.usage_per_capita_index)
    .slice(0, 10);

  const totalUsage = states.reduce((sum, s) => sum + (s.metrics.usage_count || 0), 0);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif mb-2">US State Usage</h1>
        <p className="text-gray-600 mb-8">
          Explore AI adoption patterns across all 50 US states and territories
        </p>

        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Total States"
            value={states.length}
            highlight
          />
          <MetricCard
            label="Total Usage"
            value={formatNumber(totalUsage)}
          />
          <MetricCard
            label="Highest AUI"
            value={topStates[0]?.metrics.usage_per_capita_index ?
              formatIndex(topStates[0].metrics.usage_per_capita_index) : 'N/A'}
            description={topStates[0]?.geo_id}
          />
          <MetricCard
            label="Date Range"
            value="Aug 4-11"
            description="2025"
          />
        </div>

        {/* Top States Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-serif mb-4">Top 10 States by Usage Index</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-600">Rank</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-600">State</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-600">
                    Usage Index (AUI)
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-gray-600">
                    Total Usage
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-gray-600">
                    % of US Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {topStates.map((state, index) => (
                  <tr
                    key={state.geo_id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{state.geo_id}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      {formatIndex(state.metrics.usage_per_capita_index)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {formatNumber(state.metrics.usage_count)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-600">
                      {state.metrics.usage_pct.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 bg-teal-50 rounded-lg border border-teal-200 p-4">
          <h3 className="font-medium text-teal-900 mb-2">About the Usage Index</h3>
          <p className="text-sm text-teal-800">
            The Anthropic AI Usage Index (AUI) shows whether a state uses Claude more (>1) or
            less (&lt;1) than expected based on its working-age population. An index of 3.82x
            means usage is 3.82 times higher than the state&apos;s population share would suggest.
          </p>
        </div>
      </div>
    </div>
  );
}
