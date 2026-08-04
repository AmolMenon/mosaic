import { BaseAiProvider, AiProviderContext, AiCompletionResult } from './BaseAiProvider';

export class AnthropicProvider implements BaseAiProvider {
  readonly vendor = 'anthropic';

  async generate(prompt: string, context: AiProviderContext): Promise<AiCompletionResult> {
    return {
      text: 'Mocked Anthropic response',
      usage: { promptTokens: 110, completionTokens: 45 },
      latencyMs: 1100
    };
  }

  async generateJson(prompt: string, context: AiProviderContext, jsonSchema?: any): Promise<AiCompletionResult> {
    // Uses pre-filled Assistant messages to force JSON
    return {
      text: '{"result": "mocked"}',
      usage: { promptTokens: 110, completionTokens: 45 },
      latencyMs: 1300
    };
  }
}
