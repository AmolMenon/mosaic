import { RawICReview } from "./RawICSchema";
import { ICReviewContext } from "./ICReviewContextBuilder";

export class ICReviewValidator {
  
  validate(review: RawICReview, context: ICReviewContext): boolean {
    // 1. Validate Hypothesis ID
    if (review.hypothesisId !== context.hypothesis.id) {
      return false;
    }

    // 2. Validate Evidence IDs
    const validEvidenceIds = new Set(context.allEvidence.map(e => e.id));

    // Check counterarguments
    for (const ca of review.counterarguments) {
      for (const id of ca.contradictingEvidenceIds) {
        if (!validEvidenceIds.has(id)) {
          // Hallucinated evidence ID used to strengthen an adversarial argument
          return false;
        }
      }
    }

    // Check alternative interpretations
    for (const alt of review.alternativeInterpretations) {
      for (const id of alt.supportingEvidenceIds) {
        if (!validEvidenceIds.has(id)) {
          return false;
        }
      }
    }

    return true;
  }
}
