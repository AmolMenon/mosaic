import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentService } from '../services/DocumentService';
import { queryKeys } from '../api/client';

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string, file: File }) => 
      DocumentService.upload(projectId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.list(variables.projectId) });
    }
  });
}
