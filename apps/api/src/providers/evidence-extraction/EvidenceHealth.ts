import { ProviderHealth } from "../base/ProviderHealth";

export interface EvidenceHealth extends ProviderHealth {
  matcherRegistryHealthy: boolean;
  validationRulesHealthy: boolean;
}
