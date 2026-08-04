export type NarrativeReviewStatus = 'draft' | 'in_review' | 'approved' | 'rejected';

export type NarrativeAudience = 'investment_committee' | 'partners' | 'lps' | 'portfolio_team' | 'management' | 'internal';

export type NarrativeIntent = 'recommend_investment' | 'reject_investment' | 'further_diligence' | 'portfolio_review' | 'exit_recommendation';

export type ArgumentStrength = 'high' | 'medium' | 'low';

export interface NarrativeHealth {
  validationStrength: ArgumentStrength;
  supportingInsightCount: number;
  openRisksCount: number;
  missingEvidenceCount: number;
  completenessScore: number; // 0-100
}

export interface NarrativeGap {
  id: string;
  description: string;
  severity: 'critical' | 'moderate' | 'low';
}

export interface ArgumentBlock {
  id: string;
  position: string; // The core argument being made in this block
  supportingInsightIds: string[];
  contradictingInsightIds: string[];
  openRiskIds: string[];
  outstandingAssumptionIds: string[];
  transition?: string; // Transitional commentary to the next block
  argumentStrength: ArgumentStrength;
}

export interface NarrativeSection {
  id: string;
  title: string;
  order: number;
  purpose: string; // What is this section trying to convince the reader of?
  argumentBlocks: ArgumentBlock[];
  health: NarrativeHealth;
  gaps: NarrativeGap[];
}

export interface NarrativeFlow {
  sections: NarrativeSection[];
}

export interface NarrativeReview {
  status: NarrativeReviewStatus;
  reviewerId?: string;
  lastReviewed?: string;
}

export interface NarrativeVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  authorId: string;
}

export interface Narrative {
  id: string;
  projectId: string;
  title: string;
  audience: NarrativeAudience;
  intent: NarrativeIntent;
  flow: NarrativeFlow;
  review: NarrativeReview;
  currentVersion: NarrativeVersion;
}
