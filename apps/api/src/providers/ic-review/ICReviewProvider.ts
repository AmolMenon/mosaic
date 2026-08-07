import { BaseProvider, ExecutionResult } from "../base/BaseProvider";
import { ProviderContext } from "../base/ProviderContext";
import { ProviderConfiguration } from "../base/ProviderConfiguration";
import { PipelineArtifact } from "@mosaic/contracts";

import { ICReviewContextBuilder } from "./ICReviewContextBuilder";
import { ICReviewPlanner } from "./ICReviewPlanner";
import { LLMCritic } from "./LLMCritic";
import { ICSchemaValidator } from "./ICSchemaValidator";
import { ICReviewValidator } from "./ICReviewValidator";
import { ICReviewScorer } from "./ICReviewScorer";
import { ICArtifactFactory, ReviewTrace } from "./ICArtifactFactory";
import { ICMetrics } from "./ICMetrics";
import { ICHealth } from "./ICHealth";

export class ICReviewProvider implements BaseProvider {
  
  private contextBuilder = new ICReviewContextBuilder();
  private planner = new ICReviewPlanner();
  private critic = new LLMCritic();
  private schemaValidator = new ICSchemaValidator();
  private reviewValidator = new ICReviewValidator();
  private scorer = new ICReviewScorer();

  private metricsData: ICMetrics = {
    executionCount: 0,
    averageLatencyMs: 0,
    totalRuntimeMs: 0,
    warningsCount: 0,
    failuresCount: 0,
    providerVersion: "1.0.0",
    counterargumentsGenerated: 0,
    diligenceGaps: 0,
    questionsForManagement: 0,
    risksIdentified: 0,
    alternativeInterpretations: 0,
    validationFailures: 0,
    rejectedReviews: 0,
    promptVersion: "v1.0.0-ic-json",
    modelVersion: "mock-llm-1.0",
    tokenConsumption: 0
  };

  async initialize(config: ProviderConfiguration): Promise<void> {}

  validateConfiguration(config: ProviderConfiguration): void {
    if (!config.providerId) throw new Error("Missing providerId");
  }

  async execute(inputs: PipelineArtifact[], context: ProviderContext): Promise<ExecutionResult> {
    const startTime = Date.now();

    const hypotheses = inputs.filter(a => a.type === 'HypothesisProposal');
    if (hypotheses.length === 0) {
      this.metricsData.warningsCount++;
      return { artifacts: [], metrics: this.metricsData, warnings: ["No HypothesisProposal provided"] };
    }

    const allArtifacts: Partial<PipelineArtifact>[] = [];

    for (const hArtifact of hypotheses) {
      try {
        // 1. Context Building
        const reviewContext = this.contextBuilder.build(hArtifact.payload.id, inputs);

        // 2. Prompt Formulation
        const prompt = this.planner.buildPrompt(reviewContext);

        // 3. LLM Critic
        const rawOutput = await this.critic.execute(prompt);
        this.metricsData.tokenConsumption += 800; // Mock tokens

        // 4. Schema Validation
        const validatedSchema = this.schemaValidator.validate(rawOutput);

        // 5. Evidence / Hypothesis Validation
        if (!this.reviewValidator.validate(validatedSchema, reviewContext)) {
          throw new Error("Validation failed for review: " + JSON.stringify(validatedSchema) + " with context: " + JSON.stringify(reviewContext));
        }

        // 6. Deterministic Scoring
        const scoredReview = this.scorer.score(validatedSchema);

        // Observability
        this.metricsData.counterargumentsGenerated += scoredReview.counterarguments.length;
        this.metricsData.diligenceGaps += scoredReview.missingEvidence.length;
        this.metricsData.questionsForManagement += scoredReview.questionsForManagement.length;
        this.metricsData.risksIdentified += scoredReview.risks.length;
        this.metricsData.alternativeInterpretations += scoredReview.alternativeInterpretations.length;

        // 7. Artifact Generation
        const trace: ReviewTrace = {
          promptVersion: this.metricsData.promptVersion,
          modelProvider: "mosaic-mock",
          modelVersion: this.metricsData.modelVersion,
          temperature: 0.1, // Highly deterministic adversarial posture
          inputHypothesisIds: [hArtifact.payload.id],
          inputEvidenceIds: reviewContext.allEvidence.map(e => e.id),
          generatedCounterArguments: scoredReview.counterarguments.length,
          validationResults: { passed: true },
          tokenUsage: 800,
          runtime: Date.now() - startTime
        };

        const artifacts = ICArtifactFactory.createArtifacts(scoredReview, trace, {
          pipelineId: context.workflowId,
          executionId: context.stageId,
          provider: "ic-review-llm",
          providerVersion: "1.0.0",
          documentId: context.workflowId,
          timestamp: new Date().toISOString()
        });

        allArtifacts.push(...artifacts);

      } catch (e) {
        console.error("ICReviewProvider Error:", e);
        this.metricsData.validationFailures++;
        this.metricsData.rejectedReviews++;
      }
    }

    const executionTime = Date.now() - startTime;
    this.metricsData.executionCount++;
    this.metricsData.totalRuntimeMs += executionTime;
    this.metricsData.averageLatencyMs = this.metricsData.totalRuntimeMs / this.metricsData.executionCount;

    return {
      artifacts: allArtifacts,
      metrics: this.metricsData,
      warnings: []
    };
  }

  async health(): Promise<ICHealth> {
    return {
      status: "Healthy",
      lastChecked: new Date().toISOString(),
      llmCriticHealthy: true,
      schemaRegistryHealthy: true
    };
  }

  metrics(): ICMetrics {
    return this.metricsData;
  }

  async shutdown(): Promise<void> {}
}
