import { BaseRepository } from "./BaseRepository";
import { DbCheckpoint } from "../models/DatabaseModels";
import { UnitOfWork } from "../transactions/UnitOfWork";
import { Prisma } from "@prisma/client";

export class CheckpointRepository extends BaseRepository {
  
  save(checkpoint: DbCheckpoint, uow: UnitOfWork): void {
    uow.register(async (tx: Prisma.TransactionClient) => {
      await tx.checkpoint.create({
        data: {
          checkpoint_id: checkpoint.checkpoint_id,
          execution_id: checkpoint.execution_id,
          stage_id: checkpoint.stage_id,
          artifact_ids: checkpoint.artifact_ids,
          metrics_snapshot: checkpoint.metrics_snapshot as any,
          completed_stages: checkpoint.completed_stages,
          created_at: new Date(checkpoint.created_at)
        }
      });
    });
  }

  async restore(checkpointId: string): Promise<DbCheckpoint | null> {
    const cp = await this.db.client.checkpoint.findUnique({
      where: { checkpoint_id: checkpointId }
    });
    if (!cp) return null;
    return {
      ...cp,
      metrics_snapshot: cp.metrics_snapshot as any
    };
  }

  async latest(executionId: string): Promise<DbCheckpoint | null> {
    const cp = await this.db.client.checkpoint.findFirst({
      where: { execution_id: executionId },
      orderBy: { created_at: 'desc' }
    });
    if (!cp) return null;
    return {
      ...cp,
      metrics_snapshot: cp.metrics_snapshot as any
    };
  }
}
