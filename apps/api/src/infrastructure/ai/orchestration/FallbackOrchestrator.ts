import { BaseAiProvider, AiProviderContext, AiCompletionResult } from '../providers/BaseAiProvider';

export class FallbackOrchestrator {
  private primary: BaseAiProvider;
  private fallbacks: BaseAiProvider[];

  constructor(primary: BaseAiProvider, fallbacks: BaseAiProvider[]) {
    this.primary = primary;
    this.fallbacks = fallbacks;
  }

  async executeWithFallback(prompt: string, context: AiProviderContext, isJson = false): Promise<AiCompletionResult> {
    const providers = [this.primary, ...this.fallbacks];
    let lastError: Error | null = null;

    for (const provider of providers) {
      try {
        if (isJson) {
          return await provider.generateJson(prompt, context);
        }
        return await provider.generate(prompt, context);
      } catch (err: any) {
        lastError = err;
        // Log telemetry: "Provider fallback triggered: from {provider.vendor}"
        console.warn(`Provider ${provider.vendor} failed, attempting fallback...`);
      }
    }

    throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
  }
}
