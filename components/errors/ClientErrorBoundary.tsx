'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface ClientErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Client-side Error Boundary wrapper for use in Server Components
 * This allows us to wrap server components with error boundaries
 */
export function ClientErrorBoundary({ children }: ClientErrorBoundaryProps): JSX.Element {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Custom error handling logic
        // In production, this could send to an error tracking service
        if (process.env.NODE_ENV === 'development') {
          // Development: errors are already logged to console by React
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ClientErrorBoundary;
