import { httpClient } from "../api/http";

export interface Execution {
  executionId: string;
  status: string;
  progress?: number;
}

export class ExecutionService {
  static async create(projectId: string, documentId: string): Promise<{ data: Execution }> {
    return httpClient<{ data: Execution }>('/api/v1/executions', {
      method: 'POST',
      body: JSON.stringify({ projectId, documentId })
    });
  }

  static async getStatus(executionId: string): Promise<{ data: Execution }> {
    return httpClient<{ data: Execution }>(`/api/v1/executions/${executionId}/status`);
  }
}
