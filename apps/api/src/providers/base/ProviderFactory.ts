import { BaseProvider } from "./BaseProvider";
import { ProviderConfiguration } from "./ProviderConfiguration";
import { ConfigurationError } from "./ProviderErrors";

type ProviderConstructor = new () => BaseProvider;

export class ProviderFactory {
  private constructors: Map<string, ProviderConstructor> = new Map();

  registerConstructor(id: string, ctor: ProviderConstructor) {
    this.constructors.set(id, ctor);
  }

  async create(config: ProviderConfiguration): Promise<BaseProvider> {
    const Ctor = this.constructors.get(config.providerId);
    if (!Ctor) {
      throw new ConfigurationError(`Unknown provider ID: ${config.providerId}`);
    }

    const provider = new Ctor();
    provider.validateConfiguration(config);
    await provider.initialize(config);
    
    return provider;
  }
}
