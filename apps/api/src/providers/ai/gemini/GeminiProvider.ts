import { GoogleGenAI } from '@google/genai';
import { BaseAiProvider, AiProviderContext, AiCompletionResult } from "../../../infrastructure/ai/providers/BaseAiProvider";
import { SecretsProvider } from '../../../infrastructure/secrets/SecretsProvider';
import { GeminiErrors } from './GeminiErrors';
import { GeminiJsonValidator } from './GeminiJsonValidator';
import { GeminiResponseParser } from './GeminiResponseParser';
import { GeminiMetrics } from './GeminiMetrics';
import { GeminiHealth } from './GeminiHealth';
import { defaultGeminiConfiguration } from './GeminiConfiguration';

export class GeminiProvider implements BaseAiProvider {
  readonly vendor = 'gemini';
  private ai?: GoogleGenAI;
  private secretsProvider: SecretsProvider;

  constructor(secretsProvider: SecretsProvider) {
    this.secretsProvider = secretsProvider;
  }

  async initialize(): Promise<void> {
    const apiKey = await this.secretsProvider.getSecret('GEMINI_API_KEY');
    this.ai = new GoogleGenAI({ apiKey });
  }

  async health(): Promise<boolean> {
    if (!this.ai) return false;
    return await GeminiHealth.check();
  }

  async generate(prompt: string, context: AiProviderContext): Promise<AiCompletionResult> {
    if (!this.ai) throw new Error('GeminiProvider not initialized');
    
    const startTime = Date.now();
    try {
      const response = await this.ai.models.generateContent({
        model: context.model || defaultGeminiConfiguration.model,
        contents: prompt,
        config: {
          temperature: context.temperature ?? defaultGeminiConfiguration.temperature,
          maxOutputTokens: context.maxTokens ?? defaultGeminiConfiguration.maxOutputTokens
        }
      });
      
      const latencyMs = Date.now() - startTime;
      const text = GeminiResponseParser.parseText(response);
      const usage = GeminiResponseParser.parseUsage(response);
      
      GeminiMetrics.record(latencyMs, usage.promptTokens, usage.completionTokens, context.model, crypto.randomUUID());
      
      return { text, usage, latencyMs };
    } catch (error) {
      throw GeminiErrors.mapGoogleError(error);
    }
  }

  async generateJson(prompt: string, context: AiProviderContext, jsonSchema?: any): Promise<AiCompletionResult> {
    if (!this.ai) throw new Error('GeminiProvider not initialized');
    
    const startTime = Date.now();
    try {
      const config: any = {
        temperature: context.temperature ?? defaultGeminiConfiguration.temperature,
        maxOutputTokens: context.maxTokens ?? defaultGeminiConfiguration.maxOutputTokens,
        responseMimeType: 'application/json'
      };

      if (jsonSchema) {
         // Pass native schema constraint to the API if provided
         config.responseSchema = jsonSchema;
      }

      const response = await this.ai.models.generateContent({
        model: context.model || defaultGeminiConfiguration.model,
        contents: prompt,
        config
      });
      
      const latencyMs = Date.now() - startTime;
      const rawText = GeminiResponseParser.parseText(response);
      const usage = GeminiResponseParser.parseUsage(response);
      
      GeminiMetrics.record(latencyMs, usage.promptTokens, usage.completionTokens, context.model, crypto.randomUUID());
      
      // If a schema was provided, we validate the parsed JSON rigorously using our JsonValidator
      if (jsonSchema) {
         const validation = GeminiJsonValidator.validate(rawText, jsonSchema);
         if (!validation.success) {
           throw new Error(`Invalid JSON generated: ${validation.error}`);
         }
      }

      return { text: rawText, usage, latencyMs };
    } catch (error) {
      throw GeminiErrors.mapGoogleError(error);
    }
  }

  async shutdown(): Promise<void> {
    this.ai = undefined;
  }
}
