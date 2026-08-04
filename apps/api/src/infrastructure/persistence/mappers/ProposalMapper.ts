import { DbProposal } from "../models/DatabaseModels";
import { PipelineArtifact } from "@mosaic/contracts";

export class ProposalMapper {
  static toDb(artifact: PipelineArtifact, executionId: string): DbProposal {
    return {
      proposal_id: artifact.payload.id || `prop_${Date.now()}`,
      execution_id: executionId,
      proposal_type: artifact.type,
      payload: artifact.payload,
      created_at: new Date(artifact.provenance?.timestamp || Date.now())
    };
  }
}
