import type { SWRConfiguration } from 'swr';

/**
 * Default SWR configuration optimized for static JSON data
 *
 * Features:
 * - Aggressive caching for static data (no revalidation on focus/reconnect)
 * - Automatic request deduplication
 * - Retry logic with exponential backoff
 * - Suspense support for loading states
 */
export const defaultSWRConfig: SWRConfiguration = {
  // Fetcher function for JSON data
  fetcher: (url: string) => fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status}`);
    }
    return res.json();
  }),

  // Cache configuration - aggressive for static data
  revalidateOnFocus: false, // Don't refetch when window regains focus
  revalidateOnReconnect: false, // Don't refetch when network reconnects
  revalidateIfStale: false, // Don't revalidate stale data automatically
  shouldRetryOnError: true, // Retry on error

  // Deduplication - prevent multiple requests for the same key
  dedupingInterval: 60000, // 60 seconds - dedupe requests within this window

  // Error retry configuration
  errorRetryInterval: 5000, // Wait 5s between retries
  errorRetryCount: 3, // Max 3 retry attempts

  // Keep data in cache even when component unmounts
  keepPreviousData: true,

  // Performance optimization
  suspense: false, // Set to true if you want to use React Suspense
};

/**
 * SWR configuration for frequently changing data
 * (useful if you add real-time features later)
 */
export const realtimeSWRConfig: SWRConfiguration = {
  ...defaultSWRConfig,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 30000, // Poll every 30 seconds
  dedupingInterval: 2000, // More aggressive deduplication for real-time
};
