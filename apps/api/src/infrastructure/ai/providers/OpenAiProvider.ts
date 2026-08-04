import { BaseAiProvider, AiProviderContext, AiCompletionResult } from './BaseAiProvider';

export class OpenAiProvider implements BaseAiProvider {
  readonly vendor = 'openai';

  async generate(prompt: string, context: AiProviderContext): Promise<AiCompletionResult> {
    // Stubbed OpenAI implementation
    return {
      text: 'Mocked OpenAI response',
      usage: { promptTokens: 100, completionTokens: 50 },
      latencyMs: 1200
    };
  }

  async generateJson(prompt: string, context: AiProviderContext, jsonSchema?: any): Promise<AiCompletionResult> {
    // Implementation uses response_format: { type: "json_object" } or structured outputs
    return {
      text: '{"result": "mocked"}',
      usage: { promptTokens: 100, completionTokens: 50 },
      latencyMs: 1500
    };
  }
}
