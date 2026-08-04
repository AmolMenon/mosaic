import { RawICReview } from "./RawICSchema";

export interface ScoredICReview extends RawICReview {
  computedReviewStrength: number;
  residualRisk: number;
}

export class ICReviewScorer {
  
  score(review: RawICReview): ScoredICReview {
    const counterArgsCount = review.counterarguments.length;
    const missingCount = review.missingEvidence.length;
    const riskCount = review.risks.length;
    
    // Deterministic Review Strength Metric
    // A strong review identifies multiple well-reasoned weaknesses and gaps
    let reviewStrength = 0.3 + (counterArgsCount * 0.1) + (missingCount * 0.15) + (riskCount * 0.05);
    
    // Cap at 1.0
    reviewStrength = Math.min(1.0, reviewStrength);
    
    // Residual Risk represents the severity of the flaws found in the original hypothesis
    // High counterarguments + high missing evidence = High Residual Risk for the hypothesis
    let residualRisk = Math.min(1.0, (counterArgsCount * 0.2) + (missingCount * 0.3));

    return {
      ...review,
      computedReviewStrength: reviewStrength,
      residualRisk: residualRisk
    };
  }
}
