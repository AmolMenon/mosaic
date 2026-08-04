import { PipelineCheckpointManager, PipelineCheckpoint } from "./PipelineCheckpointManager";
import { ReasoningExecutionContext } from "./ReasoningExecutionContext";
import { RecoveryFailure } from "./ReasoningErrors";

export class PipelineRecoveryManager {
  constructor(private checkpointManager: PipelineCheckpointManager) {}

  async attemptRecovery(executionId: string, context: ReasoningExecutionContext): Promise<boolean> {
    const checkpoints = await this.checkpointManager.getCheckpoints(executionId);
    
    if (checkpoints.length === 0) {
      return false; // No recovery possible
    }

    // Sort checkpoints by timestamp descending
    checkpoints.sort((a, b) => b.timestamp - a.timestamp);

    for (const checkpoint of checkpoints) {
      try {
        const isValid = await this.checkpointManager.validateCheckpoint(checkpoint);
        if (isValid) {
          // Restore context
          context.artifacts = JSON.parse(JSON.stringify(checkpoint.artifacts));
          context.completedStages = [...checkpoint.completedStages];
          context.metrics = JSON.parse(JSON.stringify(checkpoint.metricsSnapshot));
          context.metrics.recoveryCount++;
          return true; // Successfully recovered
        }
      } catch (e) {
        // Validation failed, try the previous one
        continue;
      }
    }

    throw new RecoveryFailure(`Failed to recover execution ${executionId}. All checkpoints are corrupted.`);
  }
}
