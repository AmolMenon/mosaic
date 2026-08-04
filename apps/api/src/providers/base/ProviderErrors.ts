export class ProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ProviderNotFound extends ProviderError {}
export class ProviderInitializationError extends ProviderError {}
export class ConfigurationError extends ProviderError {}
export class ProviderExecutionError extends ProviderError {}
export class ProviderTimeout extends ProviderError {}
export class ProviderUnavailable extends ProviderError {}
