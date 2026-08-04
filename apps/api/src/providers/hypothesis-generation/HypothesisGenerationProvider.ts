import { BaseProvider, ExecutionResult } from "../base/BaseProvider";
import { ProviderContext } from "../base/ProviderContext";
import { ProviderConfiguration } from "../base/ProviderConfiguration";
import { PipelineArtifact } from "@mosaic/contracts";

import { ReasoningContextBuilder } from "./ReasoningContextBuilder";
import { EvidenceGrouper } from "./EvidenceGrouper";
import { HypothesisPlanner } from "./HypothesisPlanner";
import { LLMReasoner } from "./LLMReasoner";
import { SchemaValidator } from "./SchemaValidator";
import { HypothesisValidator } from "./HypothesisValidator";
import { HypothesisScorer, ScoredHypothesis } from "./HypothesisScorer";
import { HypothesisArtifactFactory, ReasoningTrace } from "./HypothesisArtifactFactory";
import { HypothesisMetrics } from "./HypothesisMetrics";
import { HypothesisHealth } from "./HypothesisHealth";
import * as crypto from "crypto";

export class HypothesisGenerationProvider implements BaseProvider {
  
  private contextBuilder = new ReasoningContextBuilder();
  private grouper = new EvidenceGrouper();
  private planner = new HypothesisPlanner();
  private reasoner = new LLMReasoner();
  private schemaValidator = new SchemaValidator();
  private hypothesisValidator = new HypothesisValidator();
  private scorer = new HypothesisScorer();

  private metricsData: HypothesisMetrics = {
    executionCount: 0,
    averageLatencyMs: 0,
    totalRuntimeMs: 0,
    warningsCount: 0,
    failuresCount: 0,
    providerVersion: "1.0.0",
    hypothesesGenerated: 0,
    evidenceCoverage: 0,
    averageSupportingEvidence: 0,
    averageContradictingEvidence: 0,
    averageMissingEvidence: 0,
    validationFailures: 0,
    rejectedHypotheses: 0,
    promptVersion: "v1.0.0-json",
    modelVersion: "mock-llm-1.0",
    tokenConsumption: 0
  };

  async initialize(config: ProviderConfiguration): Promise<void> {}

  validateConfiguration(config: ProviderConfiguration): void {
    if (!config.providerId) throw new Error("Missing providerId");
  }

  async execute(inputs: PipelineArtifact[], context: ProviderContext): Promise<ExecutionResult> {
    const startTime = Date.now();

    // 1. Context Building
    const reasoningContext = this.contextBuilder.build(inputs);
    if (reasoningContext.evidence.length === 0) {
      this.metricsData.warningsCount++;
      return { artifacts: [], metrics: this.metricsData, warnings: ["No evidence provided"] };
    }

    // 2. Evidence Grouping
    const groupedEvidence = this.grouper.group(reasoningContext);

    // 3. Hypothesis Planning (Prompt)
    const prompt = this.planner.buildPrompt(groupedEvidence);

    // 4. LLM Reasoning
    const rawOutput = await this.reasoner.execute(prompt);
    this.metricsData.tokenConsumption += 1500; // mock tokens

    // 5. Schema Validation
    const validatedSchema = this.schemaValidator.validate(rawOutput);

    // 6. Evidence Validation & 7. Scoring
    const validScored: ScoredHypothesis[] = [];
    
    for (const h of validatedSchema.hypotheses) {
      if (this.hypothesisValidator.validate(h, reasoningContext)) {
        const scored = this.scorer.score(h);
        validScored.push(scored);
      } else {
        this.metricsData.rejectedHypotheses++;
        this.metricsData.validationFailures++;
      }
    }

    // Observability updates
    this.metricsData.hypothesesGenerated += validScored.length;
    if (validScored.length > 0) {
      this.metricsData.averageSupportingEvidence = validScored.reduce((sum, h) => sum + h.supportingEvidenceIds.length, 0) / validScored.length;
      this.metricsData.averageContradictingEvidence = validScored.reduce((sum, h) => sum + h.contradictingEvidenceIds.length, 0) / validScored.length;
    }

    const contextHash = crypto.createHash('sha256').update(JSON.stringify(groupedEvidence)).digest('hex');

    const trace: ReasoningTrace = {
      promptVersion: this.metricsData.promptVersion,
      modelProvider: "mosaic-mock",
      modelVersion: this.metricsData.modelVersion,
      temperature: 0.2,
      contextHash,
      inputEvidenceIds: reasoningContext.evidence.map(e => e.id),
      outputHypothesisIds: validScored.map(h => h.title), // Temporary ID proxy
      validationResults: { total: validatedSchema.hypotheses.length, passed: validScored.length },
      tokenUsage: 1500,
      runtime: Date.now() - startTime
    };

    // 8. Artifact Generation
    const artifacts = HypothesisArtifactFactory.createArtifacts(validScored, trace, {
      pipelineId: context.workflowId,
      executionId: context.stageId,
      provider: "hypothesis-generation-llm",
      providerVersion: "1.0.0",
      documentId: context.workflowId,
      timestamp: new Date().toISOString()
    });

    const executionTime = Date.now() - startTime;
    this.metricsData.executionCount++;
    this.metricsData.totalRuntimeMs += executionTime;
    this.metricsData.averageLatencyMs = this.metricsData.totalRuntimeMs / this.metricsData.executionCount;

    return {
      artifacts,
      metrics: this.metricsData,
      warnings: []
    };
  }

  async health(): Promise<HypothesisHealth> {
    return {
      status: "Healthy",
      lastChecked: new Date().toISOString(),
      llmProviderHealthy: true,
      schemaRegistryHealthy: true
    };
  }

  metrics(): HypothesisMetrics {
    return this.metricsData;
  }

  async shutdown(): Promise<void> {}
}
