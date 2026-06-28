'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { SWRConfig } from 'swr';
import { apiClient } from '@/lib/api-client';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create query client on demand to prevent memory leaks in SSR
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes standard caching
            gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
            refetchOnWindowFocus: false, // Avoid excessive refetching on screen focus
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig
        value={{
          dedupingInterval: 5000,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
          fetcher: (url: string) => apiClient.get(url),
        }}
      >
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              },
            }}
          />
        </NextThemesProvider>
      </SWRConfig>
    </QueryClientProvider>
  );
}
