import { useEffect, useState } from "react";
import { ExecutionEvents, ProgressEvent } from "./ExecutionEvents";
import { PollingFallback } from "./PollingFallback";

export function useProgressSubscriber(executionId: string) {
  const [progress, setProgress] = useState<ProgressEvent | null>(null);

  useEffect(() => {
    if (!executionId) return;

    let sse: ExecutionEvents;
    let fallback: PollingFallback;
    let cleanupSse: () => void;
    let cleanupFallback: () => void;

    // Try SSE first
    if (typeof EventSource !== 'undefined') {
      const url = `/api/v1/executions/${executionId}/stream`;
      sse = new ExecutionEvents(url);
      cleanupSse = sse.onProgress(setProgress);
      sse.connect();
    } else {
      // Fallback
      fallback = new PollingFallback(executionId);
      cleanupFallback = fallback.onProgress(setProgress);
      fallback.start();
    }

    return () => {
      if (sse) {
        if (cleanupSse) cleanupSse();
        sse.disconnect();
      }
      if (fallback) {
        if (cleanupFallback) cleanupFallback();
        fallback.stop();
      }
    };
  }, [executionId]);

  return progress;
}
