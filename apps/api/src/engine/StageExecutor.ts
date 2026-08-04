import { IngestionStage } from "@mosaic/contracts";
import { ExecutionContext } from "./ExecutionContext";

export class StageExecutor {
  constructor(private context: ExecutionContext) {}

  async execute(stage: IngestionStage, providerName: string): Promise<boolean> {
    this.context.logger.log({ type: "StageStarted", workflowId: this.context.workflowId, stageId: stage.id });

    // Validate Input Contract
    const hasInputs = this.context.artifacts.validateContract(stage.contract.inputArtifactTypes, stage.inputArtifactIds);
    if (!hasInputs) {
      this.context.logger.log({ type: "StageFailed", workflowId: this.context.workflowId, stageId: stage.id, payload: "Input contract validation failed" });
      throw new Error(`Input contract validation failed for stage ${stage.id}`);
    }

    const providerFn = this.context.providers.get(providerName);
    
    // Gather inputs
    const inputs: Record<string, any> = {};
    for (const artId of stage.inputArtifactIds) {
      const art = this.context.artifacts.getArtifact(artId);
      inputs[art.type] = art.payload;
    }

    try {
      // Execute Provider
      const result = await providerFn(inputs);
      
      // We expect the provider to return a single output for this mocked engine, 
      // mapped to the first output contract type
      const outType = stage.contract.outputArtifactTypes[0];
      if (!outType) {
         // Stage has no outputs
         this.context.logger.log({ type: "StageCompleted", workflowId: this.context.workflowId, stageId: stage.id });
         return true;
      }

      // Evaluate Quality Gates
      const gateResult = this.context.qualityGates.evaluate(stage.qualityGates, result);
      
      if (!gateResult.passed) {
        this.context.logger.log({ type: "QualityGateFailed", workflowId: this.context.workflowId, stageId: stage.id, payload: gateResult.failedGates });
        // Handle failure actions
        if (gateResult.failedGates.some(g => g.actionOnFailure === 'pause_for_human')) {
          stage.status = 'awaiting_human';
          // Store intermediate result anyway for human review
          const art = this.context.artifacts.storeArtifact(outType, result, stage.id, providerName, this.context.workflowId);
          stage.outputArtifactIds.push(art.id);
          return false; // Paused
        } else if (gateResult.failedGates.some(g => g.actionOnFailure === 'fail_pipeline')) {
          throw new Error(`Quality gate failed with fail_pipeline action`);
        }
      }

      // Store success output
      const artifact = this.context.artifacts.storeArtifact(outType, result, stage.id, providerName, this.context.workflowId);
      stage.outputArtifactIds.push(artifact.id);
      
      this.context.logger.log({ type: "ArtifactProduced", workflowId: this.context.workflowId, stageId: stage.id, payload: artifact.id });
      this.context.logger.log({ type: "StageCompleted", workflowId: this.context.workflowId, stageId: stage.id });
      stage.status = 'success';
      return true;

    } catch (err: any) {
      this.context.logger.log({ type: "StageFailed", workflowId: this.context.workflowId, stageId: stage.id, payload: err.message });
      
      if (this.context.retries.shouldRetry(stage.retryCount, err)) {
        stage.retryCount++;
        await this.context.retries.backoff(stage.retryCount);
        return this.execute(stage, providerName); // recursive retry
      }

      stage.status = 'failed';
      throw err;
    }
  }
}
