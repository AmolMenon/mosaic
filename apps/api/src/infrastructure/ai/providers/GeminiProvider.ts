import { BaseAiProvider, AiProviderContext, AiCompletionResult } from './BaseAiProvider';
import { GoogleGenAI } from '@google/genai';

export class GeminiProvider implements BaseAiProvider {
  readonly vendor = 'gemini';
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || 'dummy_key_if_not_provided_for_tests'
    });
  }

  async generate(prompt: string, context: AiProviderContext): Promise<AiCompletionResult> {
    const startTime = Date.now();
    const model = context.model || 'gemini-2.5-flash';

    const response = await this.client.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: context.temperature ?? 0.7,
        maxOutputTokens: context.maxTokens,
      }
    });

    const latencyMs = Date.now() - startTime;
    
    return {
      text: response.text || '',
      usage: { 
        promptTokens: response.usageMetadata?.promptTokenCount || 0, 
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0 
      },
      latencyMs
    };
  }

  async generateJson(prompt: string, context: AiProviderContext, jsonSchema?: any): Promise<AiCompletionResult> {
    const startTime = Date.now();
    const model = context.model || 'gemini-2.5-flash';

    const response = await this.client.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: context.temperature ?? 0.7,
        maxOutputTokens: context.maxTokens,
        responseMimeType: 'application/json',
        responseSchema: jsonSchema
      }
    });

    const latencyMs = Date.now() - startTime;
    
    return {
      text: response.text || '{}',
      usage: { 
        promptTokens: response.usageMetadata?.promptTokenCount || 0, 
        completionTokens: response.usageMetadata?.candidatesTokenCount || 0 
      },
      latencyMs
    };
  }
}
