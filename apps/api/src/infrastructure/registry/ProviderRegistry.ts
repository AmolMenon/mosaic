import { BaseAiProvider } from '../ai/providers/BaseAiProvider';
import { OpenAiProvider } from '../ai/providers/OpenAiProvider';
import { AnthropicProvider } from '../ai/providers/AnthropicProvider';
import { GeminiProvider } from '../../providers/ai/gemini/GeminiProvider';
import { SecretsProvider } from '../secrets/SecretsProvider';

export class ProviderRegistry {
  private static providers: Map<string, BaseAiProvider> = new Map();

  static async registerAll(secretsProvider: SecretsProvider): Promise<void> {
    const openai = new OpenAiProvider();
    const anthropic = new AnthropicProvider();
    const gemini = new GeminiProvider(secretsProvider);

    // In a real app, initialization errors should be caught and logged
    await Promise.all([
      // openai.initialize(),
      // anthropic.initialize(),
      gemini.initialize()
    ]);

    this.providers.set(openai.vendor, openai);
    this.providers.set(anthropic.vendor, anthropic);
    this.providers.set(gemini.vendor, gemini);
  }

  static getProvider(vendor: string): BaseAiProvider {
    const provider = this.providers.get(vendor);
    if (!provider) {
      throw new Error(`Provider ${vendor} not found in registry`);
    }
    return provider;
  }
}
