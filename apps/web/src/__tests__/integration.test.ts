import { QueryClient } from '@tanstack/react-query';
import { queryClient } from '../api/query-client';
import { queryKeys } from '../api/client';
import { ApiError } from '../api/errors';

// Mock fetch for tests
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

describe('Frontend Integration Layer', () => {
  beforeEach(() => {
    queryClient.clear();
    mockFetch.mockClear();
    // Setup crypto for request UUIDs in tests if needed, or mock it
    global.crypto = { randomUUID: () => 'test-uuid' } as any;
  });

  describe('Query Client Configuration', () => {
    it('should not retry on 401 Unauthorized', () => {
      const error = new ApiError(401, 'UNAUTHORIZED', 'Failed');
      const retryFn = queryClient.getDefaultOptions().queries?.retry as any;
      
      expect(retryFn(1, error)).toBe(false);
    });

    it('should retry on 500 Network Error up to 3 times', () => {
      const error = new ApiError(500, 'SERVER_ERROR', 'Failed');
      const retryFn = queryClient.getDefaultOptions().queries?.retry as any;
      
      expect(retryFn(1, error)).toBe(true);
      expect(retryFn(3, error)).toBe(false);
    });
  });

  describe('Query Keys', () => {
    it('should generate consistent query keys for projects', () => {
      expect(queryKeys.projects.list()).toEqual(['projects', 'list', undefined]);
      expect(queryKeys.projects.detail('123')).toEqual(['projects', 'detail', '123']);
    });
  });
});
