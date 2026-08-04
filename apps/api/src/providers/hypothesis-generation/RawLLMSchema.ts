export interface RawLLMHypothesis {
  title: string;
  description: string;
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  assumptions: string[];
  risks: string[];
  missingEvidence: string[];
  confidenceExplanation: string;
}

export interface RawLLMOutput {
  hypotheses: RawLLMHypothesis[];
}
