import { ProviderHealth } from "../base/ProviderHealth";

export interface ICHealth extends ProviderHealth {
  llmCriticHealthy: boolean;
  schemaRegistryHealthy: boolean;
}
