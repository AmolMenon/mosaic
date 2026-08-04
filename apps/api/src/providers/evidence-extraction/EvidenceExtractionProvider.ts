import { BaseProvider, ExecutionResult } from "../base/BaseProvider";
import { ProviderContext } from "../base/ProviderContext";
import { ProviderConfiguration } from "../base/ProviderConfiguration";
import { PipelineArtifact } from "@mosaic/contracts";

import { EvidenceMatcherRegistry, CandidateEvidence } from "./EvidenceMatcherRegistry";
import { EvidenceExtractor } from "./EvidenceExtractor";
import { EvidenceNormalizer } from "./EvidenceNormalizer";
import { EvidenceValidator } from "./EvidenceValidator";
import { EvidenceScorer, ScoredEvidence } from "./EvidenceScorer";
import { EvidenceDeduplicator } from "./EvidenceDeduplicator";
import { EvidenceArtifactFactory } from "./EvidenceArtifactFactory";
import { EvidenceMetrics } from "./EvidenceMetrics";
import { EvidenceHealth } from "./EvidenceHealth";

// Matchers
import { GrowthMatcher } from "./matchers/GrowthMatcher";

export class EvidenceExtractionProvider implements BaseProvider {
  private registry = new EvidenceMatcherRegistry();
  
  private extractor = new EvidenceExtractor(this.registry);
  private normalizer = new EvidenceNormalizer();
  private validator = new EvidenceValidator();
  private scorer = new EvidenceScorer();
  private deduplicator = new EvidenceDeduplicator();

  private metricsData: EvidenceMetrics = {
    executionCount: 0,
    averageLatencyMs: 0,
    totalRuntimeMs: 0,
    warningsCount: 0,
    failuresCount: 0,
    providerVersion: "1.0.0",
    evidenceExtracted: 0,
    evidenceRejected: 0,
    duplicateRate: 0,
    evidenceDensity: 0,
    evidencePerPage: 0,
    evidencePerEntity: 0,
    averageConfidence: 0
  };

  async initialize(config: ProviderConfiguration): Promise<void> {
    this.registry.register(new GrowthMatcher());
    // Register other matchers (FinancialStatementMatcher, PricingMatcher, etc.)
  }

  validateConfiguration(config: ProviderConfiguration): void {
    if (!config.providerId) throw new Error("Missing providerId");
  }

  async execute(inputs: PipelineArtifact[], context: ProviderContext): Promise<ExecutionResult> {
    const startTime = Date.now();

    const chunks = inputs.filter(a => a.type === 'TextChunk');
    const entityMentions = inputs.filter(a => a.type === 'EntityMention');
    
    if (chunks.length === 0) {
      this.metricsData.warningsCount++;
      return { artifacts: [], metrics: this.metricsData, warnings: ["No text chunks provided"] };
    }

    // 1. Fact Detection & Evidence Construction
    const candidates = this.extractor.extractAll(chunks, entityMentions);

    // 2-4. Normalization, Validation, Scoring
    const validScored: ScoredEvidence[] = [];
    let cumulativeConfidence = 0;

    for (const candidate of candidates) {
      const normalized = this.normalizer.normalize(candidate);
      
      if (this.validator.validate(normalized)) {
        const scored = this.scorer.score(normalized);
        validScored.push(scored);
        cumulativeConfidence += scored.confidenceScore;
      } else {
        this.metricsData.evidenceRejected++;
      }
    }

    // 5. Deduplication
    const canonicalEvidence = this.deduplicator.deduplicate(validScored);
    
    // Observability updates
    this.metricsData.evidenceExtracted += canonicalEvidence.length;
    if (validScored.length > 0) {
      this.metricsData.duplicateRate = 1 - (canonicalEvidence.length / validScored.length);
    }
    if (canonicalEvidence.length > 0) {
      this.metricsData.averageConfidence = cumulativeConfidence / validScored.length;
    }

    // 6. Artifact Generation
    const artifacts = EvidenceArtifactFactory.createArtifacts(canonicalEvidence, {
      pipelineId: context.workflowId,
      executionId: context.stageId,
      provider: "evidence-extraction-deterministic",
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

  async health(): Promise<EvidenceHealth> {
    return {
      status: "Healthy",
      lastChecked: new Date().toISOString(),
      matcherRegistryHealthy: true,
      validationRulesHealthy: true
    };
  }

  metrics(): EvidenceMetrics {
    return this.metricsData;
  }

  async shutdown(): Promise<void> {}
}
