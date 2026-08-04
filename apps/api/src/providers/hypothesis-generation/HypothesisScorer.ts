import { RawLLMHypothesis } from "./RawLLMSchema";

export interface ScoredHypothesis extends RawLLMHypothesis {
  computedConfidence: number;
}

export class HypothesisScorer {
  
  score(hypothesis: RawLLMHypothesis): ScoredHypothesis {
    const supCount = hypothesis.supportingEvidenceIds.length;
    const conCount = hypothesis.contradictingEvidenceIds.length;
    const missingCount = hypothesis.missingEvidence.length;
    
    // Deterministic Mosaic Confidence Formula
    // Disregard the LLM's "confidenceExplanation" for the actual number.
    
    let confidence = 0;
    
    if (supCount + conCount > 0) {
      // Base ratio
      confidence = supCount / (supCount + conCount);
      
      // Penalty for missing evidence
      const penalty = missingCount * 0.05;
      confidence = Math.max(0, confidence - penalty);
    }
    
    return {
      ...hypothesis,
      computedConfidence: confidence
    };
  }
}
