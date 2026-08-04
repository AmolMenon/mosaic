import { PipelineArtifact } from "@mosaic/contracts";
import { ReasoningExecutionContext } from "./ReasoningExecutionContext";
import { PipelineProgressTracker, ProgressState } from "./PipelineProgressTracker";
import { ReasoningPipelineBuilder } from "./ReasoningPipelineBuilder";
import { PipelineDependencyResolver } from "./PipelineDependencyResolver";
import { PipelineValidator } from "./PipelineValidator";
import { PipelineCheckpointManager } from "./PipelineCheckpointManager";
import { PipelineRecoveryManager } from "./PipelineRecoveryManager";
import { PipelineSummaryBuilder, ReasoningExecutionSummary } from "./PipelineSummaryBuilder";
import { ProviderExecutionFailure } from "./ReasoningErrors";
import { ProviderContext } from "../../providers/base/ProviderContext";

export class ReasoningOrchestrator {
  
  private builder = new ReasoningPipelineBuilder();
  private resolver = new PipelineDependencyResolver();
  private validator = new PipelineValidator();
  private checkpointManager = new PipelineCheckpointManager();
  private recoveryManager = new PipelineRecoveryManager(this.checkpointManager);
  private summaryBuilder = new PipelineSummaryBuilder();

  async execute(
    executionId: string, 
    pipelineId: string, 
    inputs: PipelineArtifact[], 
    resumeIfFailed: boolean = true
  ): Promise<ReasoningExecutionSummary> {
    
    const startTime = Date.now();
    const context = new ReasoningExecutionContext(executionId, pipelineId);
    const progress = new PipelineProgressTracker();
    
    try {
      progress.updateState("Preparing Workflow");

      this.validator.validateInputs(inputs);

      const rawStages = this.builder.buildDefaultPipeline();
      this.validator.validatePipeline(rawStages);
      
      const orderedStages = this.resolver.resolveOrder(rawStages);

      // Attempt Recovery
      if (resumeIfFailed) {
        const recovered = await this.recoveryManager.attemptRecovery(executionId, context);
        if (recovered) {
          progress.updateState("Recovered");
        } else {
           // Seed context with initial inputs if starting fresh
           context.addArtifacts(inputs);
        }
      } else {
        context.addArtifacts(inputs);
      }

      // Execute Stages
      for (const stage of orderedStages) {
        if (context.completedStages.includes(stage.id)) {
          continue; // Skip recovered stages
        }

        this.updateProgressForStage(stage.id, progress);
        
        const providerStart = Date.now();
        const providerContext: ProviderContext = {
          workflowId: pipelineId,
          stageId: stage.id,
          engineContext: {} as any
        };

        try {
          const result = await stage.provider.execute(context.artifacts, providerContext);
          
          context.addArtifacts(result.artifacts as PipelineArtifact[]);
          if (result.warnings) {
            context.warnings.push(...result.warnings);
          }
          
          // Merge provider metrics
          if (result.metrics) {
            context.metrics.providerVersions[stage.providerId] = result.metrics.providerVersion;
            context.metrics.llmTokenUsage += (result.metrics as any).tokenConsumption || 0;
          }

          context.markStageComplete(stage.id, Date.now() - providerStart);
          
          // Checkpoint after successful stage
          await this.checkpointManager.saveCheckpoint(stage.id, context);

        } catch (error) {
          throw new ProviderExecutionFailure(
            `Provider ${stage.providerId} failed at stage ${stage.id}`,
            stage.providerId,
            stage.id,
            error
          );
        }
      }

      progress.updateState("Packaging Results");
      // Optional: Logic to package results or push to AI Review Queue

      progress.updateState("Completed");

    } catch (e: any) {
      progress.updateState("Failed");
      context.addFailure({
        message: e.message,
        stage: (e as ProviderExecutionFailure).stage,
        providerId: (e as ProviderExecutionFailure).providerId,
        timestamp: new Date().toISOString()
      });
    }

    return this.summaryBuilder.build(context, startTime);
  }

  private updateProgressForStage(stageId: string, progress: PipelineProgressTracker) {
    const stageToProgress: Record<string, ProgressState> = {
      "stage-docling": "Parsing Document",
      "stage-entities": "Extracting Entities",
      "stage-evidence": "Building Evidence",
      "stage-hypotheses": "Generating Hypotheses",
      "stage-ic-review": "Running IC Review"
    };
    
    if (stageToProgress[stageId]) {
      progress.updateState(stageToProgress[stageId]);
    }
  }
}
