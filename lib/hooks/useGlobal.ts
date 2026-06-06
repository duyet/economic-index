import useSWR from 'swr';
import type { GeographyRecord } from '@/lib/types';
import { defaultSWRConfig } from './useSWRConfig';

/**
 * Hook to fetch global aggregate data with SWR caching
 *
 * Features:
 * - Automatic caching and deduplication
 * - Shared state across all components
 * - Built-in loading and error states
 *
 * @returns {object} SWR response with global data, loading state, and error
 *
 * @example
 * ```tsx
 * function GlobalStats() {
 *   const { data: global, error, isLoading } = useGlobal();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error loading global data</div>;
 *
 *   return <div>Total usage: {global.metrics.usage_count}</div>;
 * }
 * ```
 */
export function useGlobal() {
  const { data, error, isLoading, mutate } = useSWR<GeographyRecord>(
    '/data/global.json',
    defaultSWRConfig
  );

  return {
    data,
    global: data, // Alias for convenience
    error,
    isLoading,
    isError: !!error,
    mutate, // Allow manual revalidation if needed
  };
}
