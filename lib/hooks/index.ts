/**
 * SWR-based data fetching hooks for the Economic Index application
 *
 * These hooks provide:
 * - Automatic caching and request deduplication
 * - Shared state across all components
 * - Built-in loading and error states
 * - Optimistic updates support
 * - Automatic revalidation
 *
 * Usage:
 * ```tsx
 * import { useCountries, useStates, useOccupations } from '@/lib/hooks';
 *
 * function MyComponent() {
 *   const { data: countries, isLoading } = useCountries();
 *   // Use the data...
 * }
 * ```
 */

export { useCountries, useCountry } from './useCountries';
export { useStates, useUSState } from './useStates';
export { useOccupations, useOccupation } from './useOccupations';
export { useGlobal } from './useGlobal';
export { defaultSWRConfig, realtimeSWRConfig } from './useSWRConfig';
