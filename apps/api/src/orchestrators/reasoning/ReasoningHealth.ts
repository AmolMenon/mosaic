export interface ReasoningHealth {
  status: "Healthy" | "Degraded" | "Failed";
  lastChecked: string;
  checkpointStoreHealthy: boolean;
  activeExecutions: number;
}
