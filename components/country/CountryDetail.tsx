'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MetricCard } from '@/components/ui/MetricCard';
import MainLayout from '@/components/layout/MainLayout';
import { formatIndex, formatNumber, formatPercent } from '@/lib/utils/formatters';

interface CountryDetailProps {
  code: string;
}

export function CountryDetail({ code }: CountryDetailProps) {
  const [country, setCountry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/countries.json')
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c: any) => c.geo_id === code.toUpperCase());
        setCountry(found);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading country:', error);
        setLoading(false);
      });
  }, [code]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8">Loading...</div>
      </MainLayout>
    );
  }

  if (!country) {
    return (
      <MainLayout>
        <div className="p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-serif mb-4">Country Not Found</h1>
            <p className="text-gray-600 mb-6">
              No data available for country code: <span className="font-mono">{code}</span>
            </p>
            <Link href="/" className="text-teal-600 hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Get top tasks
  const topTasks = (country.tasks || [])
    .filter((t: any) => t.task !== 'not_classified' && t.task !== 'none')
    .sort((a: any, b: any) => (b.metrics.onet_task_pct || 0) - (a.metrics.onet_task_pct || 0))
    .slice(0, 10);

  // Get collaboration data
  const collaboration = (country.collaboration || [])
    .filter((c: any) => c.mode !== 'not_classified' && c.mode !== 'none')
    .sort((a: any, b: any) => (b.metrics.collaboration_pct || 0) - (a.metrics.collaboration_pct || 0));

  return (
    <MainLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link href="/countries" className="text-teal-600 hover:underline text-sm mb-2 inline-block">
              ← Back to all countries
            </Link>
            <h1 className="text-4xl font-serif mb-2">{country.geo_id}</h1>
            <p className="text-gray-600">Country code: {country.geo_id}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <MetricCard
              label="Usage Rank"
              value={country.metrics.usage_rank ? `#${country.metrics.usage_rank}` : 'N/A'}
              highlight
            />
            <MetricCard
              label="Usage Index"
              value={
                country.metrics.usage_per_capita_index
                  ? formatIndex(country.metrics.usage_per_capita_index)
                  : 'N/A'
              }
              description="Expected: 1.0"
            />
          <MetricCard
            label="Total Usage"
            value={formatNumber(country.metrics.usage_count || 0)}
            description={`${formatPercent(country.metrics.usage_pct || 0)} of global`}
          />
          <MetricCard
            label="Observations"
            value={formatNumber(country.metrics.usage_count || 0)}
          />
        </div>

        {/* Collaboration Modes */}
        {collaboration.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-serif mb-4">Collaboration Modes</h2>
            <div className="space-y-3">
              {collaboration.map((c: any) => (
                <div key={c.mode} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          c.mode === 'directive' || c.mode === 'feedback loop'
                            ? '#117763'
                            : '#96C1A2',
                      }}
                    />
                    <span className="capitalize">{c.mode}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {formatNumber(c.metrics.collaboration_count || 0)} conversations
                    </span>
                    <span className="font-mono font-medium w-16 text-right">
                      {formatPercent(c.metrics.collaboration_pct || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-serif mb-4">Most Frequent Topics in {country.geo_id}</h2>
          <div className="space-y-2">
            {topTasks.map((task: any, index: number) => (
              <div
                key={index}
                className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1 pr-4">
                  <span className="text-sm text-gray-600 mr-2">{index + 1}.</span>
                  <span className="text-sm">{task.task}</span>
                </div>
                <span className="font-mono text-sm font-medium whitespace-nowrap">
                  {formatPercent(task.metrics.onet_task_pct || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-teal-50 rounded-lg border border-teal-200 p-4">
          <h3 className="font-medium text-teal-900 mb-2">About This Data</h3>
          <p className="text-sm text-teal-800">
            Data collected from Claude.ai conversations during August 4-11, 2025. Tasks are
            categorized using the O*NET occupational taxonomy. Collaboration modes indicate whether
            users are automating (directive, feedback) or augmenting (learning, iteration,
            validation) their work with AI.
          </p>
        </div>
        </div>
      </div>
    </MainLayout>
  );
}
