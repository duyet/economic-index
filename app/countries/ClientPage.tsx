'use client';

import { useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { formatIndex, formatNumber } from '@/lib/utils/formatters';
import { sanitizeInput, escapeHtml } from '@/lib/utils/sanitize';
import { useCountries } from '@/lib/hooks';

export default function CountriesPage() {
  const { countries, isLoading, isError } = useCountries();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'aui' | 'usage' | 'name'>('aui');

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl">
          <header className="mb-8">
            <div className="h-12 w-64 bg-gray-200 rounded-lg animate-pulse mb-4" />
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse" />
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-soft animate-scale-in" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="space-y-4">
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-gray-100 rounded animate-pulse" />
                    <div className="h-12 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
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

  // Sanitize search input for safe filtering
  const sanitizedSearchTerm = sanitizeInput(searchTerm);

  // Filter and sort countries
  const filteredCountries = countries
    .filter((c) => {
      if (!sanitizedSearchTerm) return true;
      return c.geo_id.toLowerCase().includes(sanitizedSearchTerm.toLowerCase());
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
        <header className="mb-8">
          <h1 className="text-5xl font-serif mb-4 text-gray-900 font-light leading-tight">Countries</h1>
          <p className="text-gray-700 leading-relaxed">
            Browse AI adoption patterns across {countries.length} countries worldwide
          </p>
        </header>

        {/* Controls */}
        <div className="flex gap-4 mb-8" role="search" aria-label="Search and sort countries">
          <div className="flex-1 relative group">
            <label htmlFor="country-search" className="sr-only">Search countries</label>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="country-search"
              type="text"
              placeholder="Search countries by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:shadow-glow-teal transition-all duration-300"
              aria-label="Search countries by name or code"
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
          <label htmlFor="sort-select" className="sr-only">Sort countries</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'aui' | 'usage' | 'name')}
            className="px-6 py-3 border border-gray-200 rounded-xl bg-white shadow-soft focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:shadow-glow-teal transition-all duration-300 font-medium text-gray-700"
            aria-label="Sort countries by"
          >
            <option value="aui">Sort by Usage Index</option>
            <option value="usage">Sort by Total Usage</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-gray-600 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="font-medium">
            {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'}
          </span>
          {searchTerm && (
            <span className="text-gray-500">
              matching &quot;{searchTerm}&quot;
            </span>
          )}
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Country list">
          {filteredCountries.map((country, index) => (
            <Link
              key={country.geo_id}
              href={`/country/${country.geo_id.toLowerCase()}`}
              className="group block bg-white rounded-xl border border-gray-100 p-6 shadow-soft hover:shadow-soft-lg hover:border-teal-200 hover:scale-[1.02] transition-all duration-300 ease-out animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
              role="listitem"
              aria-label={`${country.geo_id}: Usage Index ${country.metrics.usage_per_capita_index ? formatIndex(country.metrics.usage_per_capita_index) : 'N/A'}, ${formatNumber(country.metrics.usage_count || 0)} total usage`}
            >
              {/* Header with country code and index */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center group-hover:from-teal-100 group-hover:to-teal-200 transition-colors duration-300">
                    <h3 className="font-bold text-lg text-teal-700">{country.geo_id}</h3>
                  </div>
                </div>
                <div className="text-right">
                  {country.metrics.usage_per_capita_index ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200 group-hover:shadow-glow-teal transition-shadow duration-300">
                      <div className="text-base font-bold font-mono text-teal-700">
                        {formatIndex(country.metrics.usage_per_capita_index)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 font-medium">N/A</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">Usage Index</div>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-teal-50/50 transition-colors duration-300">
                  <div className="text-xs text-gray-600 mb-1 font-medium uppercase tracking-wide">Total Usage</div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatNumber(country.metrics.usage_count || 0)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-teal-50/50 transition-colors duration-300">
                  <div className="text-xs text-gray-600 mb-1 font-medium uppercase tracking-wide">% of Global</div>
                  <div className="text-lg font-bold text-gray-900">
                    {(country.metrics.usage_pct || 0).toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" />
            </Link>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-light text-gray-900 mb-2">No countries found</h3>
            <p className="text-gray-600 mb-6">
              No countries match &quot;{escapeHtml(sanitizedSearchTerm)}&quot;
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-soft hover:shadow-soft-lg transition-all duration-300 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear search
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
