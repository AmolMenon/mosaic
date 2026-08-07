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

  private retryCount = 0;
  private maxRetries = 5;
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;

  connect() {
    if (this.eventSource) {
      this.disconnect();
    }
    this.eventSource = new EventSource(this.url, { withCredentials: true });
    
    this.eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        this.listeners.forEach(l => l(data));
        this.retryCount = 0; // Reset on success
      } catch (err) {
        // Silently ignore parse errors in production
      }
    };

    this.eventSource.onerror = (e) => {
      this.disconnect();
      if (this.retryCount < this.maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
        this.retryCount++;
        this.retryTimeout = setTimeout(() => this.connect(), delay);
      }
    };
  }

  onProgress(callback: (event: ProgressEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  disconnect() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
