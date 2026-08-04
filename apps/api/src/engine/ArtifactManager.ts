import { PipelineArtifact } from "@mosaic/contracts";
import * as crypto from "crypto";

export class ArtifactManager {
  private artifacts: Map<string, PipelineArtifact> = new Map();

  storeArtifact(
    type: string, 
    payload: any, 
    producerStage: string, 
    provider: string, 
    pipelineId: string
  ): PipelineArtifact {
    
    const artifact: PipelineArtifact = {
      id: crypto.randomUUID(),
      type,
      payload,
      provenance: {
        producerStage,
        provider,
        pipelineId,
        version: 1, // Future: Handle versions if stage is retried
        timestamp: new Date().toISOString()
      }
    };

    this.artifacts.set(artifact.id, artifact);
    return artifact;
  }

  getArtifact(id: string): PipelineArtifact {
    const artifact = this.artifacts.get(id);
    if (!artifact) {
      throw new Error(`Artifact ${id} not found in ArtifactManager`);
    }
    return artifact;
  }

  getArtifacts(): PipelineArtifact[] {
    return Array.from(this.artifacts.values());
  }

  validateContract(expectedTypes: string[], actualArtifactIds: string[]): boolean {
    const actualTypes = actualArtifactIds.map(id => this.getArtifact(id).type);
    
    for (const expected of expectedTypes) {
      if (!actualTypes.includes(expected)) {
        return false;
      }
    }
    return true;
  }
}
