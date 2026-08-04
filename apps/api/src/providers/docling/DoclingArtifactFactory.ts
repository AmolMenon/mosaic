import { PipelineArtifact } from "@mosaic/contracts";
import { MosaicDocumentStructure } from "./DoclingMapper";
import * as crypto from "crypto";

export interface ArtifactProvenanceContext {
  documentId: string;
  pipelineId: string;
  executionId: string;
  provider: string;
  providerVersion: string;
}

export class DoclingArtifactFactory {
  
  static createArtifacts(structure: MosaicDocumentStructure, context: ArtifactProvenanceContext): Partial<PipelineArtifact>[] {
    const artifacts: Partial<PipelineArtifact>[] = [];
    const timestamp = new Date().toISOString();
    
    // 1. DocumentStructureArtifact
    artifacts.push(this.buildArtifact('DocumentStructure', structure, context, timestamp));

    // 2. Chunks Artifacts (Deterministic)
    let currentSection = "";
    let readOrder = 0;

    for (const item of structure.items) {
      if (item.type === 'heading') {
        currentSection = item.content || "";
      }
      
      if (item.type === 'paragraph' || item.type === 'heading') {
        readOrder++;
        
        // Deterministic ID generation based on structural constraints
        const hash = crypto.createHash('sha256');
        hash.update(context.documentId);
        hash.update(currentSection);
        hash.update(readOrder.toString());
        hash.update(item.content || "");
        hash.update((item.metadata.pageNumber || 0).toString());
        const chunkId = hash.digest('hex');

        artifacts.push({
          id: chunkId,
          type: 'TextChunk',
          payload: {
            text: item.content,
            section: currentSection,
            readingOrder: readOrder,
            pageNumber: item.metadata.pageNumber,
            boundingBox: item.metadata.boundingBox
          },
          provenance: {
            producerStage: context.executionId,
            provider: context.provider,
            pipelineId: context.pipelineId,
            version: 1,
            timestamp
          }
        });
      }
    }

    return artifacts;
  }

  private static buildArtifact(type: string, payload: any, context: ArtifactProvenanceContext, timestamp: string): Partial<PipelineArtifact> {
    return {
      type,
      payload,
      provenance: {
        producerStage: context.executionId,
        provider: context.provider,
        pipelineId: context.pipelineId,
        version: 1,
        timestamp
      }
    };
  }
}
