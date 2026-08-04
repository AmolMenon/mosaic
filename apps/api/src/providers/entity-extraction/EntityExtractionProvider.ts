import { BaseProvider, ExecutionResult } from "../base/BaseProvider";
import { ProviderContext } from "../base/ProviderContext";
import { ProviderConfiguration } from "../base/ProviderConfiguration";
import { PipelineArtifact } from "@mosaic/contracts";
import { MatcherRegistry } from "./MatcherRegistry";
import { MentionExtractor } from "./MentionExtractor";
import { EntityNormalizer } from "./EntityNormalizer";
import { CanonicalResolver } from "./CanonicalResolver";
import { EntityDeduplicator } from "./EntityDeduplicator";
import { RelationshipRuleRegistry } from "./RelationshipRuleRegistry";
import { RelationshipExtractor } from "./RelationshipExtractor";
import { EntityArtifactFactory } from "./EntityArtifactFactory";
import { EntityHealth } from "./EntityHealth";
import { EntityMetrics } from "./EntityMetrics";
import { CompanyMatcher } from "./matchers/CompanyMatcher";
import { PercentageMatcher } from "./matchers/PercentageMatcher";
import { MetricMeasuredInPercentageRule } from "./rules/MetricMeasuredInPercentageRule";

export class EntityExtractionProvider implements BaseProvider {
  private matchers = new MatcherRegistry();
  private rules = new RelationshipRuleRegistry();
  
  private mentionExtractor = new MentionExtractor(this.matchers);
  private normalizer = new EntityNormalizer();
  private resolver = new CanonicalResolver();
  private deduplicator = new EntityDeduplicator();
  private relExtractor = new RelationshipExtractor(this.rules);
  
  private metricsData: EntityMetrics = {
    executionCount: 0,
    averageLatencyMs: 0,
    totalRuntimeMs: 0,
    warningsCount: 0,
    failuresCount: 0,
    providerVersion: "1.0.0",
    entitiesExtracted: 0,
    mentionsExtracted: 0,
    relationshipsGenerated: 0,
    duplicateRate: 0,
    mergeRate: 0,
    unknownEntityRate: 0,
    relationshipYield: 0,
    entityDensity: 0,
    entitiesPerPage: 0,
    entitiesPerChunk: 0
  };

  async initialize(config: ProviderConfiguration): Promise<void> {
    // Register matchers
    this.matchers.register(new CompanyMatcher());
    this.matchers.register(new PercentageMatcher());
    // (Other matchers would be registered here)

    // Register rules
    this.rules.register(new MetricMeasuredInPercentageRule());
  }

  validateConfiguration(config: ProviderConfiguration): void {
    if (!config.providerId) throw new Error("Missing providerId");
  }

  async execute(inputs: PipelineArtifact[], context: ProviderContext): Promise<ExecutionResult> {
    const startTime = Date.now();

    const chunks = inputs.filter(a => a.type === 'TextChunk');
    if (chunks.length === 0) {
      this.metricsData.warningsCount++;
      return { artifacts: [], metrics: this.metricsData, warnings: ["No chunks provided"] };
    }

    // 1. Mention Extraction
    const mentions = this.mentionExtractor.extractAll(chunks);
    this.metricsData.mentionsExtracted += mentions.length;

    // 2-4. Normalization, Resolution, Deduplication
    const entities = this.deduplicator.deduplicate(mentions, this.normalizer, this.resolver);
    this.metricsData.entitiesExtracted += entities.length;

    // 5. Relationship Extraction
    const relationships = this.relExtractor.extractAll(entities);
    this.metricsData.relationshipsGenerated += relationships.length;

    // 6. Artifact Generation
    const artifacts = EntityArtifactFactory.createArtifacts(entities, relationships, {
      pipelineId: context.workflowId,
      executionId: context.stageId,
      provider: "entity-extraction-deterministic",
      providerVersion: "1.0.0",
      documentId: context.workflowId, // Using workflowId as proxy for documentId
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

  async health(): Promise<EntityHealth> {
    return {
      status: "Healthy",
      lastChecked: new Date().toISOString(),
      matcherRegistryHealthy: true,
      relationshipRegistryHealthy: true,
      dictionariesLoaded: true
    };
  }

  metrics(): EntityMetrics {
    return this.metricsData;
  }

  async shutdown(): Promise<void> {}
}
