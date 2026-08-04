import { DbExecution } from "../models/DatabaseModels";

export class ExecutionMapper {
  static toDb(executionId: string, pipelineId: string, documentId: string, status: string, progressState: string): DbExecution {
    return {
      execution_id: executionId,
      pipeline_id: pipelineId,
      document_id: documentId,
      status,
      progress_state: progressState,
      version: 1, // Start at version 1
      started_at: new Date(),
      completed_at: null
    };
  }
}
