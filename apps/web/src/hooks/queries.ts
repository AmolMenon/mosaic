import { useQuery, useMutation } from '@tanstack/react-query';
import { httpClient } from '../api/http';
import { queryKeys } from '../api/client';

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => httpClient<any>(`/api/v1/projects/${id}`).then(r => r.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDocuments(projectId: string) {
  return useQuery({
    queryKey: queryKeys.documents.list(projectId),
    queryFn: () => httpClient<any>(`/api/v1/data-room/documents`).then(r => r.data),
  });
}

export function useQuestions(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(`${projectId}-questions`), // unique enough
    queryFn: () => httpClient<any>(`/api/v1/data-room/questions`).then(r => r.data),
  });
}

export function useInsights(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(`${projectId}-insights`),
    queryFn: () => httpClient<any>(`/api/v1/projects/${projectId}/insights`).then(r => r.data),
  });
}

export function useNarratives() {
  return useQuery({
    queryKey: ['narratives'],
    queryFn: () => httpClient<any>(`/api/v1/narratives`).then(r => r.data),
  });
}

export function useInsightsAll() {
  return useQuery({
    queryKey: ['insights-all'],
    queryFn: () => httpClient<any>(`/api/v1/insights`).then(r => r.data),
  });
}

export function useIngestion() {
  return useQuery({
    queryKey: ['ingestion'],
    queryFn: () => httpClient<any>(`/api/v1/ingestion`).then(r => r.data),
  });
}

export function useMemos() {
  return useQuery({
    queryKey: ['memos'],
    queryFn: () => httpClient<any>(`/api/v1/memos`).then(r => r.data),
  });
}

export function useDiscovery() {
  return useQuery({
    queryKey: ['discovery'],
    queryFn: () => httpClient<any>(`/api/v1/discovery`).then(r => r.data),
  });
}

export function useKnowledge() {
  return useQuery({
    queryKey: ['knowledge'],
    queryFn: () => httpClient<any>(`/api/v1/knowledge`).then(r => r.data),
  });
}

export function useAI() {
  return useQuery({
    queryKey: ['ai'],
    queryFn: () => httpClient<any>(`/api/v1/ai`).then(r => r.data),
  });
}

export function useQuestionsDetail() {
  return useQuery({
    queryKey: ['questions-detail'],
    queryFn: () => httpClient<any>(`/api/v1/questions`).then(r => r.data),
  });
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: (formData: FormData) => {
      return httpClient<any>('/api/v1/ingestion/upload', {
        method: 'POST',
        body: formData
      }).then(r => r.data);
    }
  });
}
