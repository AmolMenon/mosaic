import { httpClient } from "../api/http";

export interface Project {
  id: string;
  name: string;
}

export interface ListProjectsResponse {
  data: Project[];
  pagination?: { next_cursor: string | null, has_more: boolean };
}

export class ProjectService {
  static async list(limit: number = 50, cursor?: string): Promise<ListProjectsResponse> {
    const url = new URL('/api/v1/projects', window.location.origin);
    url.searchParams.append('limit', limit.toString());
    if (cursor) url.searchParams.append('cursor', cursor);
    
    return httpClient<ListProjectsResponse>(url.toString());
  }

  static async create(name: string): Promise<{ data: Project }> {
    return httpClient<{ data: Project }>('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  }
}
