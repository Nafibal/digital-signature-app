"use client";

import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider component
 * Wraps the application with TanStack Query client for server state management
 */
export default function QueryProvider({ children }: QueryProviderProps) {
  // Create a client instance that will be shared across the app
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Time in milliseconds that data remains fresh
            staleTime: 1000 * 60 * 5, // 5 minutes
            // Time in milliseconds that inactive queries will remain in cache
            gcTime: 1000 * 60 * 30, // 30 minutes
            // Number of times to retry failed queries
            retry: 1,
            // Retry only on specific error codes
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
            // Don't refetch on window focus by default
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Time in milliseconds that mutation data remains fresh
            retry: 0, // Don't retry mutations by default
          },
        },
      })
  );

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
}
