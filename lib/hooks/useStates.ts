import useSWR from 'swr';
import type { GeographyRecord } from '@/lib/types';
import { defaultSWRConfig } from './useSWRConfig';

/**
 * Hook to fetch US states data with SWR caching
 *
 * Features:
 * - Automatic caching and deduplication
 * - Shared state across all components
 * - Built-in loading and error states
 *
 * @returns {object} SWR response with states data, loading state, and error
 *
 * @example
 * ```tsx
 * function StatesList() {
 *   const { data: states, error, isLoading } = useStates();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error loading states</div>;
 *
 *   return <div>{states.length} states</div>;
 * }
 * ```
 */
export function useStates() {
  const { data, error, isLoading, mutate } = useSWR<GeographyRecord[]>(
    '/data/states.json',
    defaultSWRConfig
  );

  return {
    data,
    states: data, // Alias for convenience
    error,
    isLoading,
    isError: !!error,
    mutate, // Allow manual revalidation if needed
  };
}

/**
 * Hook to fetch a single state by code
 *
 * @param code - State code (e.g., "CA", "NY")
 * @returns {object} SWR response with state data
 *
 * @example
 * ```tsx
 * function StatePage({ code }: { code: string }) {
 *   const { data: state, isLoading } = useUSState(code);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!state) return <div>State not found</div>;
 *
 *   return <div>{state.geo_id}</div>;
 * }
 * ```
 */
export function useUSState(code: string) {
  const { data: states, error, isLoading } = useStates();

  // Find the specific state from the cached list
  const state = states?.find(
    (s) => s.geo_id.toLowerCase() === code.toLowerCase()
  );

  return {
    data: state,
    state, // Alias for convenience
    error,
    isLoading,
    isError: !!error,
    notFound: !isLoading && !state && !error,
  };
}
