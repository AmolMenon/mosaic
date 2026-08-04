export type ProgressEvent = {
  executionId: string;
  status: string;
  progress: number;
  stage: string;
  logs?: string[];
};

export class ExecutionEvents {
  private eventSource: EventSource | null = null;
  private listeners: ((event: ProgressEvent) => void)[] = [];

  constructor(private url: string) {}

  connect() {
    this.eventSource = new EventSource(this.url, { withCredentials: true });
    
    this.eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        this.listeners.forEach(l => l(data));
      } catch (err) {
        console.error("Failed to parse SSE payload", err);
      }
    };

    this.eventSource.onerror = (e) => {
      console.error("SSE Error", e);
      this.disconnect();
    };
  }

  onProgress(callback: (event: ProgressEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
