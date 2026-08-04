export interface RawCounterArgument {
  claim: string;
  contradictingEvidenceIds: string[];
}

export interface RawDiligenceGap {
  missingInformation: string;
  impactOnHypothesis: string;
}

export interface RawAlternativeInterpretation {
  description: string;
  supportingEvidenceIds: string[];
}

export interface RawICReview {
  hypothesisId: string;
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  counterarguments: RawCounterArgument[];
  missingEvidence: RawDiligenceGap[];
  questionsForManagement: string[];
  risks: string[];
  alternativeInterpretations: RawAlternativeInterpretation[];
  recommendedNextStep: string;
}
