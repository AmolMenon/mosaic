import { ExecutionService } from "../services/ExecutionService";
import { ProgressEvent } from "./ExecutionEvents";

export class PollingFallback {
  private timeoutId: any = null;
  private isPolling = false;
  private listeners: ((event: ProgressEvent) => void)[] = [];

  constructor(private executionId: string) {}

  start() {
    if (this.isPolling) return;
    this.isPolling = true;
    this.poll();
  }

  private async poll() {
    if (!this.isPolling) return;
    
    try {
      const response = await ExecutionService.getStatus(this.executionId);
      
      this.listeners.forEach(l => l({
        executionId: this.executionId,
        status: response.data.status,
        progress: response.data.progress || 0,
        stage: "Polling"
      }));

      // If completed, stop polling
      if (response.data.status === 'COMPLETED' || response.data.status === 'FAILED') {
        this.stop();
        return;
      }
    } catch (e) {
      console.warn("Polling failed", e);
    }
    
    this.timeoutId = setTimeout(() => this.poll(), 2000); // Intelligent backoff could go here
  }

  onProgress(callback: (event: ProgressEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  stop() {
    this.isPolling = false;
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}
