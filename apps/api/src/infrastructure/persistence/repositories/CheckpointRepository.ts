import { BaseRepository } from "./BaseRepository";
import { DbCheckpoint } from "../models/DatabaseModels";
import { UnitOfWork } from "../transactions/UnitOfWork";

export class CheckpointRepository extends BaseRepository {
  
  save(checkpoint: DbCheckpoint, uow: UnitOfWork): void {
    uow.register(async () => {
      this.db.memoryStore.checkpoints.push(checkpoint);
    });
  }

  async restore(checkpointId: string): Promise<DbCheckpoint | null> {
    const cp = this.db.memoryStore.checkpoints.find(c => c.checkpoint_id === checkpointId);
    return cp || null;
  }

  async latest(executionId: string): Promise<DbCheckpoint | null> {
    const cps = this.db.memoryStore.checkpoints.filter(c => c.execution_id === executionId);
    if (cps.length === 0) return null;
    return cps.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0];
  }
}
