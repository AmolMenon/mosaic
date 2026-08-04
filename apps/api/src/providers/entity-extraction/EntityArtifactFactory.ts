import { PipelineArtifact } from "@mosaic/contracts";
import { CanonicalEntity } from "./EntityDeduplicator";
import { ExtractedRelationship } from "./RelationshipRuleRegistry";

export interface EntityArtifactContext {
  pipelineId: string;
  executionId: string;
  provider: string;
  providerVersion: string;
  documentId: string;
  timestamp: string;
}

export class EntityArtifactFactory {
  
  static createArtifacts(
    entities: CanonicalEntity[], 
    relationships: ExtractedRelationship[],
    context: EntityArtifactContext
  ): Partial<PipelineArtifact>[] {
    
    const artifacts: Partial<PipelineArtifact>[] = [];

    // Entity Artifacts
    for (const entity of entities) {
      artifacts.push(this.buildArtifact('Entity', {
        id: entity.id,
        canonicalName: entity.canonicalName,
        type: entity.entityType,
        normalizedValue: entity.normalizedValue,
        aliases: Array.from(entity.aliases)
      }, context));
      
      for (const mention of entity.mentions) {
        artifacts.push(this.buildArtifact('EntityMention', {
          entityId: entity.id,
          ...mention
        }, context));
      }
    }

    // Relationship Artifacts
    for (const rel of relationships) {
      artifacts.push(this.buildArtifact('EntityRelationship', rel, context));
    }

    // Entity Catalog Artifact
    const catalog = this.buildCatalog(entities);
    artifacts.push(this.buildArtifact('EntityCatalog', catalog, context));

    return artifacts;
  }

  private static buildCatalog(entities: CanonicalEntity[]) {
    const catalog: Record<string, any[]> = {};
    for (const entity of entities) {
      if (!catalog[entity.entityType]) catalog[entity.entityType] = [];
      catalog[entity.entityType].push({ id: entity.id, name: entity.canonicalName });
    }
    return catalog;
  }

  private static buildArtifact(type: string, payload: any, context: EntityArtifactContext): Partial<PipelineArtifact> {
    return {
      type,
      payload,
      provenance: {
        producerStage: context.executionId,
        provider: context.provider,
        pipelineId: context.pipelineId,
        version: 1,
        timestamp: context.timestamp
      }
    };
  }
}
