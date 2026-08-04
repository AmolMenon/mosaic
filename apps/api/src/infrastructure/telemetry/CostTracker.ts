export interface CostMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  provider: string;
  model: string;
  latencyMs: number;
}

export interface CostTracker {
  /**
   * Records the token usage and cost for a specific LLM execution.
   */
  recordCost(executionId: string, projectId: string, metrics: CostMetrics): Promise<void>;
  
  /**
   * Aggregates the total cost for a given execution.
   */
  getExecutionCost(executionId: string): Promise<number>;
  
  /**
   * Aggregates the total cost across all executions in a project.
   */
  getProjectCost(projectId: string): Promise<number>;
}
