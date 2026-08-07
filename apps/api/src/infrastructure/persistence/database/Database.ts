import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { DatabaseHealth } from "./DatabaseHealth";
import { logger } from "../../../utils/logger";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

/**
 * PostgreSQL Database Client for the persistence layer wrapping Prisma.
 */
export class Database {
  public client: PrismaClient;

  constructor() {
    this.client = new PrismaClient({ adapter }).$extends({
      query: {
        $allModels: {
          async $allOperations({ operation, model, args, query }) {
            try {
              const start = Date.now();
              const result = await query(args);
              const duration = Date.now() - start;
              
              if (['create', 'update', 'delete', 'updateMany', 'deleteMany'].includes(operation)) {
                if (process.env.NODE_ENV !== 'production' || duration > 100) {
                  logger.info(`[Audit] ${operation} on ${model}`, { durationMs: duration, model, operation });
                }
              }
              return result;
            } catch (error) {
              throw error;
            }
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
    let status: "Healthy" | "Degraded" | "Failed" = "Healthy";
    try {
      await this.client.$queryRaw`SELECT 1`;
    } catch (e) {
      status = "Failed";
    }
    return {
      status,
      latencyMs: Date.now() - start,
      activeConnections: 1,
      lastChecked: new Date()
    };
  }
}
