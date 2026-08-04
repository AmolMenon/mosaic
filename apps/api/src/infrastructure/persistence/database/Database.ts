import { DatabaseHealth } from "./DatabaseHealth";

/**
 * Mocked PostgreSQL Database Client for the persistence layer.
 * In production, this would wrap 'pg' or a query builder.
 */
export class Database {
  // In-memory mock for testing
  public memoryStore: Record<string, any[]> = {
    executions: [],
    pipeline_artifacts: [],
    checkpoints: [],
    execution_metrics: [],
    proposals: []
  };

  async connect(): Promise<void> {
    // connect logic
  }

  async disconnect(): Promise<void> {
    // disconnect logic
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    // A real DB would execute the query. For our mock, we just return empty array
    // Testing relies on specialized mock behavior or the repositories abstracting it.
    return { rows: [] };
  }

  async health(): Promise<DatabaseHealth> {
    return {
      status: "Healthy",
      latencyMs: 5,
      activeConnections: 1,
      lastChecked: new Date()
    };
  }
}
