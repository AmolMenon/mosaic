import { ProviderHealth } from "../base/ProviderHealth";

export interface EntityHealth extends ProviderHealth {
  matcherRegistryHealthy: boolean;
  relationshipRegistryHealthy: boolean;
  dictionariesLoaded: boolean;
}
