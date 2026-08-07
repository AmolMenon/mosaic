import { BaseAiProvider, AiProviderContext, AiCompletionResult } from './BaseAiProvider';
import Anthropic from '@anthropic-ai/sdk';

export class AnthropicProvider implements BaseAiProvider {
  readonly vendor = 'anthropic';
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_if_not_provided_for_tests'
    });
  }

  async generate(prompt: string, context: AiProviderContext): Promise<AiCompletionResult> {
    const startTime = Date.now();
    const model = context.model || 'claude-3-5-sonnet-latest';

    const response = await this.client.messages.create({
      model: model,
      max_tokens: context.maxTokens || 4096,
      temperature: context.temperature ?? 0.7,
      messages: [{ role: 'user', content: prompt }]
    });

    const latencyMs = Date.now() - startTime;
    
    // Anthropic's text content is the first block if it's text
    const textContent = response.content.find(c => c.type === 'text');
    const text = textContent && textContent.type === 'text' ? textContent.text : '';

    return {
      text,
      usage: { 
        promptTokens: response.usage?.input_tokens || 0, 
        completionTokens: response.usage?.output_tokens || 0 
      },
      latencyMs
    };
  }

  async generateJson(prompt: string, context: AiProviderContext, jsonSchema?: any): Promise<AiCompletionResult> {
    const startTime = Date.now();
    const model = context.model || 'claude-3-5-sonnet-latest';

    // Prefill assistant message with { to force JSON output
    const response = await this.client.messages.create({
      model: model,
      max_tokens: context.maxTokens || 4096,
      temperature: context.temperature ?? 0.7,
      messages: [
        { role: 'user', content: prompt + (jsonSchema ? `\n\nEnsure output matches this schema: ${JSON.stringify(jsonSchema)}` : '') },
        { role: 'assistant', content: '{' }
      ]
    });

    const latencyMs = Date.now() - startTime;
    const textContent = response.content.find(c => c.type === 'text');
    const text = textContent && textContent.type === 'text' ? '{' + textContent.text : '{}';

    return {
      text,
      usage: { 
        promptTokens: response.usage?.input_tokens || 0, 
        completionTokens: response.usage?.output_tokens || 0 
      },
      latencyMs
    };
  }
}
