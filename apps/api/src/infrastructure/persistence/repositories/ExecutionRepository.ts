import { BaseRepository } from "./BaseRepository";
import { DbExecution } from "../models/DatabaseModels";
import { UnitOfWork } from "../transactions/UnitOfWork";
import { OptimisticLockError, RecordNotFoundError } from "../database/DatabaseErrors";

export class ExecutionRepository extends BaseRepository {
  
  create(execution: DbExecution, uow: UnitOfWork): void {
    uow.register(async () => {
      this.db.memoryStore.executions.push(execution);
    });
  }

  update(executionId: string, updates: Partial<DbExecution>, currentVersion: number, uow: UnitOfWork): void {
    uow.register(async () => {
      const idx = this.db.memoryStore.executions.findIndex(e => e.execution_id === executionId);
      if (idx === -1) {
        throw new RecordNotFoundError(`Execution ${executionId} not found.`);
      }
      const existing = this.db.memoryStore.executions[idx];
      if (existing.version !== currentVersion) {
        throw new OptimisticLockError(`Version mismatch. Expected ${currentVersion}, got ${existing.version}`);
      }
      
      this.db.memoryStore.executions[idx] = {
        ...existing,
        ...updates,
        version: currentVersion + 1
      };
    });
  }
  
  async find(executionId: string): Promise<DbExecution | null> {
    const execution = this.db.memoryStore.executions.find(e => e.execution_id === executionId);
    return execution ? { ...execution } : null; // return copy to simulate db read
  }
}
