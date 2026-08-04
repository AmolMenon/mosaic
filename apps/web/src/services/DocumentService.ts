import { httpClient } from "../api/http";

export interface Document {
  id: string;
  projectId: string;
  filename: string;
}

export class DocumentService {
  static async upload(projectId: string, file: File): Promise<{ data: Document }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);

    // Note: We don't set Content-Type here, let the browser set it with the boundary for FormData
    // We would need to bypass the default httpClient if it forcefully sets application/json
    // For this implementation, assume a generic file upload fetch or a modified httpClient
    
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/api/v1/documents', {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}`, 'X-Request-Id': crypto.randomUUID() } : { 'X-Request-Id': crypto.randomUUID() },
      body: formData
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  }
}
