import { PipelineArtifact } from "@mosaic/contracts";
import { ICContextBuildingFailure } from "./ICErrors";

export interface ICReviewContext {
  hypothesis: any;
  citedEvidence: any[];
  allEvidence: any[];
}

export class ICReviewContextBuilder {
  build(hypothesisId: string, inputs: PipelineArtifact[]): ICReviewContext {
    const hypothesisArtifact = inputs.find(a => a.type === 'HypothesisProposal' && a.payload.id === hypothesisId);
    if (!hypothesisArtifact) {
      throw new ICContextBuildingFailure(`Hypothesis ${hypothesisId} not found`);
    }

    const evidenceCatalog = inputs.find(a => a.type === 'EvidenceCatalog');
    if (!evidenceCatalog) {
      throw new ICContextBuildingFailure("Missing EvidenceCatalog");
    }

    const hypothesis = hypothesisArtifact.payload;
    const allEvidence: any[] = [];
    
    // Flatten catalog
    for (const [type, items] of Object.entries(evidenceCatalog.payload)) {
      if (Array.isArray(items)) {
        allEvidence.push(...items);
      }
    }

    const citedIds = new Set([
      ...hypothesis.supportingEvidenceIds,
      ...hypothesis.contradictingEvidenceIds
    ]);

    const citedEvidence = allEvidence.filter(e => citedIds.has(e.id));

    return {
      hypothesis,
      citedEvidence,
      allEvidence
    };
  }
}
