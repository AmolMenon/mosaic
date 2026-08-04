export interface AiProviderContext {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface AiCompletionResult {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
  latencyMs: number;
}

export interface BaseAiProvider {
  /**
   * Identifies the vendor (e.g., 'openai', 'anthropic', 'gemini').
   */
  readonly vendor: string;

  /**
   * Generates a completion for the given prompt.
   * Throws AiProviderError on rate limits or network issues.
   */
  generate(prompt: string, context: AiProviderContext): Promise<AiCompletionResult>;

  /**
   * Generates a strict JSON output matching the requested schema.
   */
  generateJson(prompt: string, context: AiProviderContext, jsonSchema?: any): Promise<AiCompletionResult>;
}
