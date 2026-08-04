import { PipelineArtifact } from "@mosaic/contracts";
import { ReasoningExecutionContext } from "./ReasoningExecutionContext";
import { CheckpointCorruptionFailure } from "./ReasoningErrors";

export interface PipelineCheckpoint {
  executionId: string;
  stageId: string;
  timestamp: number;
  artifacts: PipelineArtifact[];
  metricsSnapshot: any;
  completedStages: string[];
}

export class PipelineCheckpointManager {
  private memoryStore: Map<string, PipelineCheckpoint[]> = new Map();

  async saveCheckpoint(stageId: string, context: ReasoningExecutionContext): Promise<void> {
    const start = Date.now();
    
    // In production, this would serialize artifacts and write to a durable object store.
    // For this implementation, we use an in-memory store.
    
    const checkpoint: PipelineCheckpoint = {
      executionId: context.executionId,
      stageId,
      timestamp: Date.now(),
      // Deep copy to prevent mutation
      artifacts: JSON.parse(JSON.stringify(context.artifacts)),
      metricsSnapshot: JSON.parse(JSON.stringify(context.metrics)),
      completedStages: [...context.completedStages]
    };

    let checkpoints = this.memoryStore.get(context.executionId);
    if (!checkpoints) {
      checkpoints = [];
      this.memoryStore.set(context.executionId, checkpoints);
    }
    
    checkpoints.push(checkpoint);

    context.metrics.checkpointCount++;
    context.metrics.executionLatencyMs += (Date.now() - start);
  }

  async getCheckpoints(executionId: string): Promise<PipelineCheckpoint[]> {
    return this.memoryStore.get(executionId) || [];
  }

  async validateCheckpoint(checkpoint: PipelineCheckpoint): Promise<boolean> {
    if (!checkpoint.executionId || !checkpoint.stageId || !Array.isArray(checkpoint.artifacts)) {
      throw new CheckpointCorruptionFailure(`Checkpoint for stage ${checkpoint.stageId} is malformed.`);
    }
    return true;
  }
}
