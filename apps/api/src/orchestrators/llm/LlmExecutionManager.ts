export interface LlmExecutionOptions {
  model: string;
  provider: string; // e.g., 'openai', 'anthropic'
  priority?: 'high' | 'normal' | 'low';
  timeoutMs?: number;
  maxTokens?: number;
  temperature?: number;
}

export interface LlmExecutionResult {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
  };
  latencyMs: number;
  provider: string;
  model: string;
}

export interface LlmExecutionManager {
  /**
   * Enqueues an LLM request into the centralized token bucket/concurrency manager.
   * Handles rate limit headers (429), quotas, and automatic fallback providers.
   */
  execute(prompt: string, options: LlmExecutionOptions): Promise<LlmExecutionResult>;
}
