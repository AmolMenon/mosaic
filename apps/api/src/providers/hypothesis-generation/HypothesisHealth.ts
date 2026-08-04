import { ProviderHealth } from "../base/ProviderHealth";

export interface HypothesisHealth extends ProviderHealth {
  llmProviderHealthy: boolean;
  schemaRegistryHealthy: boolean;
}
