import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectService } from '../services/ProjectService';
import { queryKeys } from '../api/client';

export function useProjects(limit?: number, cursor?: string) {
  return useQuery({
    queryKey: queryKeys.projects.list({ limit, cursor }),
    queryFn: () => ProjectService.list(limit, cursor),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => ProjectService.create(name),
    onSuccess: () => {
      // Invalidate list on success
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => ProjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    }
  });
}
