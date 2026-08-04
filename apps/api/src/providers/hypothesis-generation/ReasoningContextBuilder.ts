import { PipelineArtifact } from "@mosaic/contracts";

export interface ReasoningContext {
  evidence: any[];
  entities: any[];
  documentMetadata?: any;
  projectMetadata?: any;
}

export class ReasoningContextBuilder {
  build(inputs: PipelineArtifact[]): ReasoningContext {
    const evidenceArtifact = inputs.find(a => a.type === 'EvidenceCatalog');
    const entityArtifact = inputs.find(a => a.type === 'EntityCatalog');
    
    if (!evidenceArtifact) {
      throw new Error("Missing EvidenceCatalog");
    }

    // Flatten evidence catalog back into array for easier prompt injection
    const evidence: any[] = [];
    if (evidenceArtifact.payload) {
      for (const [type, items] of Object.entries(evidenceArtifact.payload)) {
        if (Array.isArray(items)) {
          evidence.push(...items.map(i => ({ ...i, category: type })));
        }
      }
    }

    return {
      evidence,
      entities: entityArtifact?.payload || {},
      documentMetadata: inputs.find(a => a.type === 'DocumentMetadata')?.payload,
      projectMetadata: inputs.find(a => a.type === 'ProjectMetadata')?.payload
    };
  }
}
