export class GeminiMetrics {
  static record(latencyMs: number, promptTokens: number, completionTokens: number, model: string, requestId: string): void {
    // In a real implementation, this forwards to TelemetryProvider / Prometheus
    console.log(`[GeminiMetrics] Request ${requestId} | Model: ${model} | Latency: ${latencyMs}ms | Tokens: ${promptTokens} prompt, ${completionTokens} completion`);
  }
}
