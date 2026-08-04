import { QueryClient } from '@tanstack/react-query';
import { ApiError, NetworkError } from './errors';

const FIVE_MINUTES = 1000 * 60 * 5;
const TEN_MINUTES = 1000 * 60 * 10;
const THIRTY_MINUTES = 1000 * 60 * 30;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry auth or validation errors
        if (error instanceof ApiError) {
          if (error.status === 401 || error.status === 403 || error.status === 400) {
            return false;
          }
        }
        return failureCount < 3;
      },
      // Default to 5 minutes, can be overridden per query
      staleTime: FIVE_MINUTES,
      refetchOnWindowFocus: true,
    },
  },
});
