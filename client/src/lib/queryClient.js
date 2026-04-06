import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, 
      gcTime: 1000 * 60 * 5, // 5 minutes cache
      retry: (failureCount, error) => {
        // Don't retry on 401, 403, 404
        const status = error?.response?.status;
        if ([401, 403, 404].includes(status)) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchInterval: false, 
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;