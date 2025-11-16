import useSWR from 'swr';
import type { OccupationRecord } from '@/lib/types';
import { defaultSWRConfig } from './useSWRConfig';

/**
 * Hook to fetch occupations data with SWR caching
 *
 * Features:
 * - Automatic caching and deduplication
 * - Shared state across all components
 * - Built-in loading and error states
 * - Large dataset optimized caching
 *
 * @returns {object} SWR response with occupations data, loading state, and error
 *
 * @example
 * ```tsx
 * function OccupationsList() {
 *   const { data: occupations, error, isLoading } = useOccupations();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error loading occupations</div>;
 *
 *   return <div>{occupations.length} occupations</div>;
 * }
 * ```
 */
export function useOccupations() {
  const { data, error, isLoading, mutate } = useSWR<OccupationRecord[]>(
    '/data/occupations.json',
    defaultSWRConfig
  );

  return {
    data,
    occupations: data, // Alias for convenience
    error,
    isLoading,
    isError: !!error,
    mutate, // Allow manual revalidation if needed
  };
}

/**
 * Hook to fetch a single occupation by title or ID
 *
 * @param identifier - Occupation title or ID
 * @returns {object} SWR response with occupation data
 *
 * @example
 * ```tsx
 * function OccupationPage({ title }: { title: string }) {
 *   const { data: occupation, isLoading } = useOccupation(title);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!occupation) return <div>Occupation not found</div>;
 *
 *   return <div>{occupation.occupation_title}</div>;
 * }
 * ```
 */
export function useOccupation(identifier: string) {
  const { data: occupations, error, isLoading } = useOccupations();

  // Find the specific occupation from the cached list
  const occupation = occupations?.find(
    (o) =>
      o.occupation_title.toLowerCase() === identifier.toLowerCase() ||
      o.occupation_title.toLowerCase().includes(identifier.toLowerCase())
  );

  return {
    data: occupation,
    occupation, // Alias for convenience
    error,
    isLoading,
    isError: !!error,
    notFound: !isLoading && !occupation && !error,
  };
}
