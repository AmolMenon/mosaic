import { ProviderMetrics } from "../base/ProviderMetrics";

export interface HypothesisMetrics extends ProviderMetrics {
  hypothesesGenerated: number;
  evidenceCoverage: number;
  averageSupportingEvidence: number;
  averageContradictingEvidence: number;
  averageMissingEvidence: number;
  validationFailures: number;
  rejectedHypotheses: number;
  promptVersion: string;
  modelVersion: string;
  tokenConsumption: number;
}
