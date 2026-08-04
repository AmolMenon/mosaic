import { PipelineArtifact } from "@mosaic/contracts";
import { CanonicalEvidence } from "./EvidenceDeduplicator";
import { EvidenceType } from "./EvidenceTypeRegistry";

export interface EvidenceArtifactContext {
  pipelineId: string;
  executionId: string;
  provider: string;
  providerVersion: string;
  documentId: string;
  timestamp: string;
}

export class EvidenceArtifactFactory {
  
  static createArtifacts(
    evidenceList: CanonicalEvidence[], 
    context: EvidenceArtifactContext
  ): Partial<PipelineArtifact>[] {
    
    const artifacts: Partial<PipelineArtifact>[] = [];

    // Evidence Proposal Artifacts
    for (const ev of evidenceList) {
      artifacts.push(this.buildArtifact('EvidenceProposal', ev, context));
      
      // Emit reference artifacts back to the entities
      for (const entityId of ev.referencedEntityIds) {
        artifacts.push(this.buildArtifact('EvidenceReference', {
          evidenceId: ev.evidenceId,
          entityId: entityId
        }, context));
      }
    }

    // Evidence Catalog Artifact
    const catalog = this.buildCatalog(evidenceList);
    artifacts.push(this.buildArtifact('EvidenceCatalog', catalog, context));

    return artifacts;
  }

  private static buildCatalog(evidenceList: CanonicalEvidence[]) {
    const catalog: Record<string, any[]> = {};
    for (const type of Object.values(EvidenceType)) {
      catalog[type] = evidenceList
        .filter(e => e.evidenceType === type)
        .map(e => ({ id: e.evidenceId, statement: e.statement }));
    }
    return catalog;
  }

  private static buildArtifact(type: string, payload: any, context: EvidenceArtifactContext): Partial<PipelineArtifact> {
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
