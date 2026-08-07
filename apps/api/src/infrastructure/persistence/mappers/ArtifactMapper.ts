import { PipelineArtifact } from "@mosaic/contracts";
import { DbPipelineArtifact } from "../models/DatabaseModels";

export class ArtifactMapper {
  static toDb(artifact: PipelineArtifact, executionId: string, documentId: string): DbPipelineArtifact {
    return {
      artifact_id: artifact.payload.id || `${artifact.type}_${Date.now()}`,
      execution_id: executionId,
      document_id: documentId,
      artifact_type: artifact.type,
      payload: artifact.payload, // Opaque JSONB
      producer_stage: artifact.provenance?.producerStage || "unknown",
      provider_id: artifact.provenance?.provider || "unknown",
      provider_version: artifact.provenance?.version?.toString() || "1.0",
      created_at: new Date(artifact.provenance?.timestamp || Date.now())
    };
  }

  static toDomain(dbModel: DbPipelineArtifact): PipelineArtifact {
    return {
      id: dbModel.artifact_id,
      type: dbModel.artifact_type,
      payload: dbModel.payload,
      provenance: {
        producerStage: dbModel.producer_stage,
        provider: dbModel.provider_id,
        pipelineId: "unknown", // Derived separately if needed
        version: parseFloat(dbModel.provider_version) || 1.0,
        timestamp: dbModel.created_at.toISOString()
      }
    };
  }
}
