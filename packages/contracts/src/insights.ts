import { ExplainableConfidence } from "./questions";

export type InsightStatus = 'draft' | 'peer_review' | 'lead_review' | 'validated' | 'superseded' | 'archived';
export type InsightCategory = 'financial' | 'commercial' | 'legal' | 'market' | 'operational';
export type InsightRelationshipType = 'supports' | 'contradicts' | 'depends_on' | 'supersedes';

export interface InsightOwnership {
  authorId: string;
  reviewerId?: string;
  lastReviewed?: string;
  reviewNotes?: string;
}

export interface InsightValidation {
  supportingHypothesisIds: string[];
  conflictingHypothesisIds: string[];
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  outstandingAssumptionIds: string[];
  outstandingRiskIds: string[];
  confidence: ExplainableConfidence;
  confidenceExplanation: string;
}

export interface InsightVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  authorId: string;
}

export interface InsightRelationship {
  id: string;
  sourceInsightId: string;
  targetInsightId: string;
  type: InsightRelationshipType;
}

export interface InsightCollection {
  id: string;
  projectId: string;
  name: string; // e.g., 'Pricing', 'Competition', 'Growth'
  description?: string;
  insightIds: string[];
}

export interface Insight {
  id: string;
  projectId: string;
  statement: string;
  analystCommentary: string;
  
  status: InsightStatus;
  category: InsightCategory;
  isPromotedToPrinciple: boolean; // True when it becomes institutional knowledge
  
  sourceQuestionIds: string[];
  
  validation: InsightValidation;
  ownership: InsightOwnership;
  currentVersion: InsightVersion;
}
