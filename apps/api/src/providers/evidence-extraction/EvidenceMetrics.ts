import { ProviderMetrics } from "../base/ProviderMetrics";

export interface EvidenceMetrics extends ProviderMetrics {
  evidenceExtracted: number;
  evidenceRejected: number;
  duplicateRate: number;
  evidenceDensity: number;
  evidencePerPage: number;
  evidencePerEntity: number;
  averageConfidence: number;
}
