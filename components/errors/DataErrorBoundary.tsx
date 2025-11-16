'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface DataErrorBoundaryProps {
  children: ReactNode;
  componentName?: string;
}

/**
 * Specialized Error Boundary for data-loading components
 * Provides a more specific error message for data-related failures
 */
export function DataErrorBoundary({ children, componentName = 'component' }: DataErrorBoundaryProps): JSX.Element {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="w-full p-8 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Failed to load {componentName}
              </h3>
              <p className="mt-2 text-sm text-red-700">
                There was a problem loading this data visualization. This might be due to:
              </p>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                <li>Missing or corrupted data files</li>
                <li>Network connectivity issues</li>
                <li>Browser compatibility problems</li>
              </ul>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-red-800 hover:text-red-900">
                    Technical Details
                  </summary>
                  <pre className="mt-2 text-xs bg-white border border-red-300 rounded p-2 overflow-x-auto text-red-900">
                    {error.message}
                  </pre>
                </details>
              )}
              <div className="mt-4">
                <button
                  onClick={reset}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export default DataErrorBoundary;
