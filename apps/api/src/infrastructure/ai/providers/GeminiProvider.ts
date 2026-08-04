import { BaseAiProvider, AiProviderContext, AiCompletionResult } from './BaseAiProvider';

export class GeminiProvider implements BaseAiProvider {
  readonly vendor = 'gemini';

  async generate(prompt: string, context: AiProviderContext): Promise<AiCompletionResult> {
    return {
      text: 'Mocked Gemini response',
      usage: { promptTokens: 105, completionTokens: 60 },
      latencyMs: 950
    };
  }

  async generateJson(prompt: string, context: AiProviderContext, jsonSchema?: any): Promise<AiCompletionResult> {
    // Uses Gemini system instructions and responseSchema
    return {
      text: '{"result": "mocked"}',
      usage: { promptTokens: 105, completionTokens: 60 },
      latencyMs: 1150
    };
  }
}
