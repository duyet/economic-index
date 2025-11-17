'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatIndex, formatNumber } from '@/lib/utils/formatters';
import { DataErrorBoundary } from '@/components/errors';
import { ChartSkeleton } from '@/components/ui/skeletons';
import { useCountries } from '@/lib/hooks';

// Lazy load chart components for code splitting
const UsageIndexChart = dynamic(
  () => import('@/components/charts/UsageIndexChart').then((mod) => ({ default: mod.UsageIndexChart })),
  {
    loading: () => <ChartSkeleton height={400} />,
  }
);

const CollaborationChart = dynamic(
  () => import('@/components/charts/CollaborationChart').then((mod) => ({ default: mod.CollaborationChart })),
  {
    loading: () => <ChartSkeleton height={300} />,
  }
);

export default function ComparePage() {
  const { countries, isLoading, isError } = useCountries();
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'GB', 'CA']);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl">
          <header className="mb-8">
            <div className="h-12 w-72 bg-gray-200 rounded-lg animate-pulse mb-4" />
            <div className="h-6 w-full max-w-2xl bg-gray-200 rounded animate-pulse" />
          </header>
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-soft">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !countries) {
    return (
      <MainLayout>
        <div className="max-w-6xl">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-light text-gray-900 mb-2">Error loading countries data</h2>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const selectedData = countries.filter((c) =>
    selectedCountries.includes(c.geo_id)
  );

  // Prepare data for charts
  const indexData = selectedData.map((c) => ({
    geo_id: c.geo_id,
    name: c.geo_id,
    index: c.metrics.usage_per_capita_index || 0,
  }));

  const handleCountryToggle = (geoId: string) => {
    if (selectedCountries.includes(geoId)) {
      setSelectedCountries(selectedCountries.filter((id) => id !== geoId));
    } else if (selectedCountries.length < 10) {
      setSelectedCountries([...selectedCountries, geoId]);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-5xl font-serif mb-4 text-gray-900 font-light leading-tight">Compare Countries</h1>
          <p className="text-gray-700 leading-relaxed">
            Select up to 10 countries to compare AI adoption patterns, usage metrics, and
            collaboration modes.
          </p>
        </div>

        {/* Country Selector */}
        <Card className="mb-8 shadow-soft-lg border-gray-100 hover:shadow-soft-xl transition-shadow duration-300">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Selected Countries</span>
              </CardTitle>
              <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                selectedCountries.length >= 10
                  ? 'bg-red-100 text-red-700'
                  : 'bg-teal-100 text-teal-700'
              }`}>
                {selectedCountries.length}/10
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Selected countries pills */}
            {selectedCountries.length > 0 ? (
              <div className="flex flex-wrap gap-2.5 mb-6">
                {selectedCountries.map((geoId) => (
                  <button
                    key={geoId}
                    onClick={() => handleCountryToggle(geoId)}
                    className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-full text-sm font-medium shadow-soft hover:shadow-glow-teal hover:scale-105 transition-all duration-300"
                  >
                    <span>{geoId}</span>
                    <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm text-gray-500 font-medium">No countries selected</p>
                <p className="text-xs text-gray-400 mt-1">Select countries below to start comparing</p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Add countries:</p>
                {selectedCountries.length > 0 && (
                  <button
                    onClick={() => setSelectedCountries([])}
                    className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {countries
                  .filter(
                    (c) =>
                      !selectedCountries.includes(c.geo_id) &&
                      c.metrics.usage_count > 100
                  )
                  .slice(0, 20)
                  .map((country) => (
                    <button
                      key={country.geo_id}
                      onClick={() => handleCountryToggle(country.geo_id)}
                      disabled={selectedCountries.length >= 10}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium shadow-soft hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-300"
                    >
                      {country.geo_id}
                    </button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card className="mb-8 shadow-soft-lg border-gray-100 overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span>Usage Metrics Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider text-gray-700">Country</th>
                    <th className="text-right py-4 px-6 font-semibold text-sm uppercase tracking-wider text-gray-700">Usage Index</th>
                    <th className="text-right py-4 px-6 font-semibold text-sm uppercase tracking-wider text-gray-700">Total Usage</th>
                    <th className="text-right py-4 px-6 font-semibold text-sm uppercase tracking-wider text-gray-700">% of Global</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedData.map((country, index) => (
                    <tr
                      key={country.geo_id}
                      className="hover:bg-teal-50/30 transition-colors duration-200 group animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center group-hover:from-teal-100 group-hover:to-teal-200 transition-colors">
                            <span className="font-bold text-sm text-teal-700">{country.geo_id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {country.metrics.usage_per_capita_index ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200">
                            <span className="font-bold font-mono text-sm text-teal-700">
                              {formatIndex(country.metrics.usage_per_capita_index)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 font-medium">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-base font-semibold text-gray-900">
                        {formatNumber(country.metrics.usage_count || 0)}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-base font-semibold text-gray-600">
                        {(country.metrics.usage_pct || 0).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Usage Index Chart */}
        <div className="mb-6">
          <DataErrorBoundary componentName="Usage Index Chart">
            <UsageIndexChart
              data={indexData}
              title="Usage Index Comparison"
              description="Compare AI adoption rates across selected countries"
            />
          </DataErrorBoundary>
        </div>

        {/* Collaboration Modes for Each Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedData.slice(0, 4).map((country) => {
            // Transform collaboration data to match chart expectations
            const collaborationData = (country.collaboration || []).map((c) => ({
              mode: c.mode,
              count: c.metrics.collaboration_count,
              pct: c.metrics.collaboration_pct,
            }));

            return (
              <DataErrorBoundary key={country.geo_id} componentName="Collaboration Chart">
                <CollaborationChart
                  data={collaborationData}
                  title={`${country.geo_id} - Collaboration Modes`}
                  description={`${formatNumber(country.metrics.usage_count || 0)} conversations`}
                />
              </DataErrorBoundary>
            );
          })}
        </div>

        {selectedData.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-light text-gray-900 mb-3">No countries selected</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Select at least one country from the selector above to start comparing AI adoption metrics
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl shadow-soft-lg font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span>Select countries above</span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
