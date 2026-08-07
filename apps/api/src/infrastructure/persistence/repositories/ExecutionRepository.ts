import { BaseRepository } from "./BaseRepository";
import { DbExecution } from "../models/DatabaseModels";
import { UnitOfWork } from "../transactions/UnitOfWork";
import { OptimisticLockError, RecordNotFoundError } from "../database/DatabaseErrors";
import { Prisma } from "@prisma/client";

export class ExecutionRepository extends BaseRepository {
  
  create(execution: DbExecution, uow: UnitOfWork): void {
    uow.register(async (tx: Prisma.TransactionClient) => {
      await tx.execution.create({
        data: {
          execution_id: execution.execution_id,
          pipeline_id: execution.pipeline_id,
          document_id: execution.document_id,
          status: execution.status,
          progress_state: execution.progress_state,
          version: execution.version,
          started_at: new Date(execution.started_at),
          completed_at: execution.completed_at ? new Date(execution.completed_at) : null
        }
      });
    });
  }

  update(executionId: string, updates: Partial<DbExecution>, currentVersion: number, uow: UnitOfWork): void {
    uow.register(async (tx: Prisma.TransactionClient) => {
      const existing = await tx.execution.findUnique({
        where: { execution_id: executionId }
      });
      if (!existing) {
        throw new RecordNotFoundError(`Execution ${executionId} not found.`);
      }
      if (existing.version !== currentVersion) {
        throw new OptimisticLockError(`Version mismatch. Expected ${currentVersion}, got ${existing.version}`);
      }
      
      await tx.execution.update({
        where: { execution_id: executionId },
        data: {
          ...updates,
          started_at: updates.started_at ? new Date(updates.started_at) : undefined,
          completed_at: updates.completed_at ? new Date(updates.completed_at) : undefined,
          version: currentVersion + 1
        }
      });
    });
  }
  
  async find(executionId: string): Promise<DbExecution | null> {
    const execution = await this.db.client.execution.findUnique({
      where: { execution_id: executionId }
    });
    if (!execution) return null;
    return {
      ...execution,
      started_at: execution.started_at,
      completed_at: execution.completed_at ? execution.completed_at : null
    };
  }
}
