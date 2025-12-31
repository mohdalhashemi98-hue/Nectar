import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes - keep data fresh longer
      gcTime: 1000 * 60 * 60, // 1 hour cache
      retry: 1, // Faster failure
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false, // Don't refetch on every mount
    },
    mutations: {
      retry: 0,
    },
  },
});
