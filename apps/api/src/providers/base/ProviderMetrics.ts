export interface ProviderMetrics {
  executionCount: number;
  averageLatencyMs: number;
  totalRuntimeMs: number;
  warningsCount: number;
  failuresCount: number;
  lastExecutionAt?: string;
  providerVersion: string;
}
