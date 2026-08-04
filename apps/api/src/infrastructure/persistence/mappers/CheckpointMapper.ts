import { DbCheckpoint } from "../models/DatabaseModels";

export class CheckpointMapper {
  static toDb(
    checkpointId: string,
    executionId: string, 
    stageId: string, 
    artifactIds: string[], 
    metricsSnapshot: any, 
    completedStages: string[]
  ): DbCheckpoint {
    return {
      checkpoint_id: checkpointId,
      execution_id: executionId,
      stage_id: stageId,
      artifact_ids: artifactIds,
      metrics_snapshot: metricsSnapshot,
      completed_stages: completedStages,
      created_at: new Date()
    };
  }
}
