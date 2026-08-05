import { BaseRepository } from "./BaseRepository";
import { DbExecutionMetric } from "../models/DatabaseModels";
import { UnitOfWork } from "../transactions/UnitOfWork";
import { Prisma } from "@prisma/client";

export class MetricsRepository extends BaseRepository {
  
  save(metric: DbExecutionMetric, uow: UnitOfWork): void {
    uow.register(async (tx: Prisma.TransactionClient) => {
      await tx.executionMetric.create({
        data: {
          execution_id: metric.execution_id,
          stage_id: metric.stage_id,
          provider_id: metric.provider_id,
          latency_ms: metric.latency_ms,
          token_usage: metric.token_usage,
          created_at: new Date(metric.created_at)
        }
      });
    });
  }
}
