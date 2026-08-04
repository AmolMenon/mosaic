import { PipelineArtifact } from "@mosaic/contracts";
import { ReasoningMetrics } from "./ReasoningMetrics";

export class ReasoningExecutionContext {
  public executionId: string;
  public pipelineId: string;
  public artifacts: PipelineArtifact[] = [];
  public completedStages: string[] = [];
  public warnings: string[] = [];
  public failures: any[] = [];
  
  public metrics: ReasoningMetrics = {
    executionLatencyMs: 0,
    stageLatencies: {},
    providerLatencies: {},
    checkpointCount: 0,
    recoveryCount: 0,
    artifactsProduced: 0,
    artifactsRejected: 0,
    qualityGateFailures: 0,
    retryCount: 0,
    providerVersions: {},
    llmTokenUsage: 0,
    memoryUsageMb: 0
  };

  constructor(executionId: string, pipelineId: string) {
    this.executionId = executionId;
    this.pipelineId = pipelineId;
  }

  addArtifacts(newArtifacts: PipelineArtifact[]) {
    this.artifacts.push(...newArtifacts);
    this.metrics.artifactsProduced += newArtifacts.length;
  }

  markStageComplete(stageId: string, latencyMs: number) {
    this.completedStages.push(stageId);
    this.metrics.stageLatencies[stageId] = latencyMs;
  }

  addWarning(warning: string) {
    this.warnings.push(warning);
  }

  addFailure(failure: any) {
    this.failures.push(failure);
  }
}
