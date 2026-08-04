import { CandidateEvidence } from "./EvidenceMatcherRegistry";

export interface ScoredEvidence extends CandidateEvidence {
  confidenceScore: number;
}

export class EvidenceScorer {
  
  score(evidence: CandidateEvidence): ScoredEvidence {
    let score = 0.5; // Base confidence
    
    // Deterministic scoring based on rule structure
    if (evidence.extractionRule.includes("Regex")) {
      score += 0.2; // Regex matches have higher literal confidence
    }
    
    if (evidence.referencedEntityIds.length > 1) {
      score += 0.15; // Relational fact
    }
    
    // Cap at 1.0
    return {
      ...evidence,
      confidenceScore: Math.min(1.0, score)
    };
  }
}
