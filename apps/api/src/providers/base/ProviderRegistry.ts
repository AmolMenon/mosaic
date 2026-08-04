import { BaseProvider } from "./BaseProvider";
import { ProviderNotFound } from "./ProviderErrors";

export class ProviderRegistry {
  private providers: Map<string, BaseProvider> = new Map();

  register(name: string, provider: BaseProvider): void {
    this.providers.set(name, provider);
  }

  resolve(name: string): BaseProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new ProviderNotFound(`Provider '${name}' not found in registry.`);
    }
    return provider;
  }

  replace(name: string, provider: BaseProvider): void {
    this.providers.set(name, provider);
  }

  getCapabilities(name: string): string[] {
    // In a full implementation, this would query the provider for its capabilities
    return [];
  }
}
