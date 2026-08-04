export type ProviderHealthStatus = 'Healthy' | 'Degraded' | 'Unavailable' | 'Unknown';

export interface ProviderHealth {
  status: ProviderHealthStatus;
  lastChecked: string;
  details?: Record<string, any>;
}
