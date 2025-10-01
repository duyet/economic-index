'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsageIndexChart } from '@/components/charts/UsageIndexChart';
import { CollaborationChart } from '@/components/charts/CollaborationChart';
import { formatIndex, formatNumber } from '@/lib/utils/formatters';

export default function ComparePage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'GB', 'CA']);

  useEffect(() => {
    fetch('/data/countries.json')
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading countries:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8">Loading...</div>
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Selected Countries ({selectedCountries.length}/10)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCountries.map((geoId) => (
                <button
                  key={geoId}
                  onClick={() => handleCountryToggle(geoId)}
                  className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm hover:bg-teal-200 flex items-center gap-2"
                >
                  {geoId}
                  <span className="text-xs">✕</span>
                </button>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Add countries:</p>
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
                      className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {country.geo_id}
                    </button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Usage Metrics Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-medium">Country</th>
                    <th className="text-right py-2 px-4 font-medium">Usage Index</th>
                    <th className="text-right py-2 px-4 font-medium">Total Usage</th>
                    <th className="text-right py-2 px-4 font-medium">% of Global</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData.map((country) => (
                    <tr key={country.geo_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{country.geo_id}</td>
                      <td className="py-3 px-4 text-right font-mono">
                        {country.metrics.usage_per_capita_index
                          ? formatIndex(country.metrics.usage_per_capita_index)
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {formatNumber(country.metrics.usage_count || 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-gray-600">
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
          <UsageIndexChart
            data={indexData}
            title="Usage Index Comparison"
            description="Compare AI adoption rates across selected countries"
          />
        </div>

        {/* Collaboration Modes for Each Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedData.slice(0, 4).map((country) => (
            <CollaborationChart
              key={country.geo_id}
              data={country.collaboration || []}
              title={`${country.geo_id} - Collaboration Modes`}
              description={`${formatNumber(country.metrics.usage_count || 0)} conversations`}
            />
          ))}
        </div>

        {selectedData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No countries selected</p>
            <p className="text-sm">Select at least one country to compare metrics</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
