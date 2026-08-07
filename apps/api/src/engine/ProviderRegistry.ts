export type ProviderExecuteFn = (inputs: Record<string, any>, context?: any) => Promise<Record<string, any>>;

export interface ProviderRegistration {
  name: string;
  execute: ProviderExecuteFn;
}

export class ProviderRegistry {
  private providers: Map<string, ProviderExecuteFn> = new Map();

  register(name: string, execute: ProviderExecuteFn): void {
    if (this.providers.has(name)) {
      throw new Error(`Provider ${name} is already registered`);
    }
    this.providers.set(name, execute);
  }

  get(name: string): ProviderExecuteFn {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} not found in registry`);
    }
    return provider;
  }
}
