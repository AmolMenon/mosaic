import { ProviderMetrics } from "../base/ProviderMetrics";

export interface EntityMetrics extends ProviderMetrics {
  entitiesExtracted: number;
  mentionsExtracted: number;
  relationshipsGenerated: number;
  duplicateRate: number;
  mergeRate: number;
  unknownEntityRate: number;
  relationshipYield: number;
  entityDensity: number;
  entitiesPerPage: number;
  entitiesPerChunk: number;
}
