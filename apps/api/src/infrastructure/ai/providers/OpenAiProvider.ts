import { BaseAiProvider, AiProviderContext, AiCompletionResult } from './BaseAiProvider';
import OpenAI from 'openai';

export class OpenAiProvider implements BaseAiProvider {
  readonly vendor = 'openai';
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy_key_if_not_provided_for_tests'
    });
  }

  async generate(prompt: string, context: AiProviderContext): Promise<AiCompletionResult> {
    const startTime = Date.now();
    
    // Default model if not specified
    const model = context.model || 'gpt-4o';
    
    const response = await this.client.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: context.temperature ?? 0.7,
      max_tokens: context.maxTokens,
    });

    const latencyMs = Date.now() - startTime;
    
    return {
      text: response.choices[0]?.message?.content || '',
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0
      },
      latencyMs
    };
  }

  async generateJson(prompt: string, context: AiProviderContext, jsonSchema?: any): Promise<AiCompletionResult> {
    const startTime = Date.now();
    const model = context.model || 'gpt-4o';
    
    const response = await this.client.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: context.temperature ?? 0.7,
      max_tokens: context.maxTokens,
      response_format: { type: 'json_object' }
    });

    const latencyMs = Date.now() - startTime;
    
    return {
      text: response.choices[0]?.message?.content || '{}',
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0
      },
      latencyMs
    };
  }
}
