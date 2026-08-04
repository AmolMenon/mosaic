export interface ProviderConfiguration {
  providerId: string;
  version: string;
  timeoutMs: number;
  maxRetries: number;
  processingProfile: string;
  debugMode: boolean;
  custom?: Record<string, any>;
}
