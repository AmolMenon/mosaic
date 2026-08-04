import { RawLLMHypothesis } from "./RawLLMSchema";
import { ReasoningContext } from "./ReasoningContextBuilder";
import { EvidenceValidationFailure } from "./HypothesisErrors";

export class HypothesisValidator {
  
  validate(hypothesis: RawLLMHypothesis, context: ReasoningContext): boolean {
    const validEvidenceIds = new Set(context.evidence.map(e => e.id));

    // Hallucination Check: Reject if any cited ID does not exist in the catalog
    const allCitedIds = [
      ...hypothesis.supportingEvidenceIds,
      ...hypothesis.contradictingEvidenceIds
    ];

    for (const id of allCitedIds) {
      if (!validEvidenceIds.has(id)) {
        // Deterministically rejected due to hallucinated Evidence ID
        return false;
      }
    }

    // Constraint Check: Max assumptions exceeded
    if (hypothesis.assumptions.length > 5) {
      return false; 
    }

    // Must cite at least one piece of evidence (unless explicitly a hypothesis about missing data)
    if (hypothesis.supportingEvidenceIds.length === 0 && hypothesis.contradictingEvidenceIds.length === 0) {
        return false;
    }

    return true;
  }
}
