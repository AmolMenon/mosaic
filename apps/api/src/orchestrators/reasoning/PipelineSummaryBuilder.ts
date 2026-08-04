import { ReasoningExecutionContext } from "./ReasoningExecutionContext";
import { ReasoningMetrics } from "./ReasoningMetrics";

export interface ReasoningExecutionSummary {
  executionId: string;
  pipelineId: string;
  workflowVersion: string;
  providerVersions: Record<string, string>;
  executionDurationMs: number;
  artifactsProduced: number;
  entityCount: number;
  evidenceCount: number;
  hypothesisCount: number;
  counterargumentCount: number;
  diligenceGapCount: number;
  qualityGateResults: { passed: boolean };
  warnings: string[];
  failures: any[];
  checkpointCount: number;
  recoveryCount: number;
  retries: number;
  tokenUsage: number;
}

export class PipelineSummaryBuilder {
  
  build(context: ReasoningExecutionContext, startTime: number): ReasoningExecutionSummary {
    const artifacts = context.artifacts;
    
    // Calculate artifact counts based on their type
    let entityCount = 0;
    let evidenceCount = 0;
    
    // Some artifacts might be Catalogs (arrays of items) or discrete items
    const entityCatalogs = artifacts.filter(a => a.type === "EntityCatalog");
    entityCatalogs.forEach(c => {
      Object.values(c.payload).forEach((arr: any) => {
        if (Array.isArray(arr)) entityCount += arr.length;
      });
    });

    const evidenceCatalogs = artifacts.filter(a => a.type === "EvidenceCatalog");
    evidenceCatalogs.forEach(c => {
      Object.values(c.payload).forEach((arr: any) => {
        if (Array.isArray(arr)) evidenceCount += arr.length;
      });
    });

    const hypothesisCount = artifacts.filter(a => a.type === "HypothesisProposal").length;
    const counterargumentCount = artifacts.filter(a => a.type === "CounterArgument").length;
    const diligenceGapCount = artifacts.filter(a => a.type === "DiligenceGap").length;

    return {
      executionId: context.executionId,
      pipelineId: context.pipelineId,
      workflowVersion: "1.0.0",
      providerVersions: context.metrics.providerVersions,
      executionDurationMs: Date.now() - startTime,
      artifactsProduced: context.metrics.artifactsProduced,
      entityCount,
      evidenceCount,
      hypothesisCount,
      counterargumentCount,
      diligenceGapCount,
      qualityGateResults: { passed: context.failures.length === 0 },
      warnings: context.warnings,
      failures: context.failures,
      checkpointCount: context.metrics.checkpointCount,
      recoveryCount: context.metrics.recoveryCount,
      retries: context.metrics.retryCount,
      tokenUsage: context.metrics.llmTokenUsage
    };
  }
}
