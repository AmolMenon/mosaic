import { ProviderMetrics } from "../base/ProviderMetrics";

export interface ICMetrics extends ProviderMetrics {
  counterargumentsGenerated: number;
  diligenceGaps: number;
  questionsForManagement: number;
  risksIdentified: number;
  alternativeInterpretations: number;
  validationFailures: number;
  rejectedReviews: number;
  promptVersion: string;
  modelVersion: string;
  tokenConsumption: number;
}
