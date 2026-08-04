export interface ReasoningMetrics {
  executionLatencyMs: number;
  stageLatencies: Record<string, number>;
  providerLatencies: Record<string, number>;
  checkpointCount: number;
  recoveryCount: number;
  artifactsProduced: number;
  artifactsRejected: number;
  qualityGateFailures: number;
  retryCount: number;
  providerVersions: Record<string, string>;
  llmTokenUsage: number;
  memoryUsageMb: number;
}
