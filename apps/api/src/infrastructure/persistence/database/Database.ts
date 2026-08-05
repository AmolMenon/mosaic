import { PrismaClient } from "@prisma/client";
import { DatabaseHealth } from "./DatabaseHealth";
/**
 * PostgreSQL Database Client for the persistence layer wrapping Prisma.
 */
export class Database {
  public client: PrismaClient;

  constructor() {
    this.client = new PrismaClient().$extends({
      query: {
        $allModels: {
          async $allOperations({ operation, model, args, query }) {
            const result = await query(args);
            // Example of audit logging for mutations (create, update, delete)
            if (['create', 'update', 'delete', 'updateMany', 'deleteMany'].includes(operation)) {
              // Note: We don't have request context here, but in a real app
              // you'd pass user/tenant context via async local storage.
              // We just log to console here or we can emit an event.
              console.log(`[Audit] ${operation} on ${model}`);
            }
            return result;
          }
        }
      }
    }) as any; // Cast as any because of extension type issues in strict mode
  }

  async connect(): Promise<void> {
    await this.client.$connect();
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    // Escape hatch for raw queries if needed by legacy parts of the system
    return await this.client.$queryRawUnsafe(sql, ...params);
  }

  async health(): Promise<DatabaseHealth> {
    const start = Date.now();
    let status = "Healthy";
    try {
      await this.client.$queryRaw`SELECT 1`;
    } catch (e) {
      status = "Unhealthy";
    }
    return {
      status,
      latencyMs: Date.now() - start,
      activeConnections: 1,
      lastChecked: new Date()
    };
  }
}
