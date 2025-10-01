'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { formatIndex, formatNumber } from '@/lib/utils/formatters';

export default function CountriesPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'aui' | 'usage' | 'name'>('aui');

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

  // Filter and sort countries
  const filteredCountries = countries
    .filter((c) => {
      if (!searchTerm) return true;
      return c.geo_id.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'aui') {
        return (b.metrics.usage_per_capita_index || 0) - (a.metrics.usage_per_capita_index || 0);
      }
      if (sortBy === 'usage') {
        return (b.metrics.usage_count || 0) - (a.metrics.usage_count || 0);
      }
      return a.geo_id.localeCompare(b.geo_id);
    });

  return (
    <MainLayout>
      <div className="max-w-6xl">
        <h1 className="text-5xl font-serif mb-4 text-gray-900 font-light leading-tight">Countries</h1>
        <p className="text-gray-700 mb-8 leading-relaxed">
          Browse AI adoption patterns across {countries.length} countries worldwide
        </p>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="aui">Sort by Usage Index</option>
            <option value="usage">Sort by Total Usage</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCountries.map((country) => (
            <Link
              key={country.geo_id}
              href={`/country/${country.geo_id.toLowerCase()}`}
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-teal-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{country.geo_id}</h3>
                <div className="text-right">
                  {country.metrics.usage_per_capita_index ? (
                    <div className="text-sm font-mono text-teal-600">
                      {formatIndex(country.metrics.usage_per_capita_index)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">N/A</div>
                  )}
                  <div className="text-xs text-gray-500">Usage Index</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-600">Total Usage</div>
                  <div className="font-medium">
                    {formatNumber(country.metrics.usage_count || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">% of Global</div>
                  <div className="font-medium">
                    {(country.metrics.usage_pct || 0).toFixed(2)}%
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No countries found matching &quot;{searchTerm}&quot;
          </div>
        )}
      </div>
    </MainLayout>
  );
}
