import { DbExecutionMetric } from "../models/DatabaseModels";

export class MetricsMapper {
  static toDb(executionId: string, stageId: string, providerId: string, latencyMs: number, tokenUsage: number): DbExecutionMetric {
    return {
      execution_id: executionId,
      stage_id: stageId,
      provider_id: providerId,
      latency_ms: latencyMs,
      token_usage: tokenUsage,
      created_at: new Date()
    };
  }
}
