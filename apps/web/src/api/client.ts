/**
 * Centralized Query Key Factory.
 * Do not hardcode query keys in components or hooks.
 */
export const queryKeys = {
  projects: {
    all: () => ['projects'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.projects.all(), 'list', filters] as const,
    detail: (id: string) => [...queryKeys.projects.all(), 'detail', id] as const,
  },
  documents: {
    all: () => ['documents'] as const,
    list: (projectId: string) => [...queryKeys.documents.all(), 'list', { projectId }] as const,
    detail: (id: string) => [...queryKeys.documents.all(), 'detail', id] as const,
  },
  executions: {
    all: () => ['executions'] as const,
    list: (projectId: string) => [...queryKeys.executions.all(), 'list', { projectId }] as const,
    detail: (id: string) => [...queryKeys.executions.all(), 'detail', id] as const,
  },
  artifacts: {
    all: () => ['artifacts'] as const,
    list: (executionId: string) => [...queryKeys.artifacts.all(), 'list', { executionId }] as const,
    detail: (id: string) => [...queryKeys.artifacts.all(), 'detail', id] as const,
  },
  knowledge: {
    all: () => ['knowledge'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.knowledge.all(), 'list', filters] as const,
    asset: (id: string) => [...queryKeys.knowledge.all(), 'asset', id] as const,
  }
};
