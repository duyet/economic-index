import useSWR from 'swr';
import type { GeographyRecord } from '@/lib/types';
import { defaultSWRConfig } from './useSWRConfig';

/**
 * Hook to fetch countries data with SWR caching
 *
 * Features:
 * - Automatic caching and deduplication
 * - Shared state across all components
 * - Built-in loading and error states
 * - Optimistic updates support
 *
 * @returns {object} SWR response with countries data, loading state, and error
 *
 * @example
 * ```tsx
 * function CountriesList() {
 *   const { data: countries, error, isLoading } = useCountries();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error loading countries</div>;
 *
 *   return <div>{countries.length} countries</div>;
 * }
 * ```
 */
export function useCountries() {
  const { data, error, isLoading, mutate } = useSWR<GeographyRecord[]>(
    '/data/countries.json',
    defaultSWRConfig
  );

  return {
    data,
    countries: data, // Alias for convenience
    error,
    isLoading,
    isError: !!error,
    mutate, // Allow manual revalidation if needed
  };
}

/**
 * Hook to fetch a single country by code
 *
 * @param code - Country code (e.g., "US", "GB")
 * @param initialData - Optional initial country data for SSG/SSR
 * @returns {object} SWR response with country data
 *
 * @example
 * ```tsx
 * function CountryPage({ code }: { code: string }) {
 *   const { data: country, isLoading } = useCountry(code);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!country) return <div>Country not found</div>;
 *
 *   return <div>{country.geo_id}</div>;
 * }
 * ```
 */
export function useCountry(code: string, initialData?: GeographyRecord) {
  const { data: countries, error, isLoading } = useCountries();

  // Find the specific country from the cached list
  const country = countries?.find(
    (c) => c.geo_id.toLowerCase() === code.toLowerCase()
  );

  // Use initialData if countries haven't loaded yet (important for SSG)
  const finalCountry = country || initialData;

  return {
    data: finalCountry,
    country: finalCountry, // Alias for convenience
    error,
    isLoading,
    isError: !!error,
    notFound: !isLoading && !finalCountry && !error,
  };
}
