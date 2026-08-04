import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExecutionService } from '../services/ExecutionService';
import { queryKeys } from '../api/client';

export function useExecutionStatus(executionId: string, isExecuting: boolean) {
  return useQuery({
    queryKey: queryKeys.executions.detail(executionId),
    queryFn: () => ExecutionService.getStatus(executionId),
    // Always fresh if running, don't refetch if not (rely on streaming for live updates)
    staleTime: isExecuting ? 0 : 1000 * 60 * 30,
    enabled: !!executionId
  });
}

export function useCreateExecution() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, documentId }: { projectId: string, documentId: string }) => 
      ExecutionService.create(projectId, documentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.executions.all() });
    }
  });
}
