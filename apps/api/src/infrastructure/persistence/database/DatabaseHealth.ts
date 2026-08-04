export interface DatabaseHealth {
  status: "Healthy" | "Degraded" | "Failed";
  latencyMs: number;
  activeConnections: number;
  lastChecked: Date;
}
