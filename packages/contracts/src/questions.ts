export type QuestionStatus = 
  | 'created' 
  | 'investigating' 
  | 'evidence_found' 
  | 'evidence_missing' 
  | 'needs_review' 
  | 'answered' 
  | 'approved' 
  | 'closed';

export type QuestionPriority = 'low' | 'medium' | 'high' | 'critical';
export type QuestionCategory = 'financial' | 'legal' | 'commercial' | 'technical' | 'market';

export type HypothesisStatus = 'open' | 'supported' | 'rejected' | 'needs_validation' | 'escalated';
export type ExplainableConfidence = 'high' | 'medium' | 'low';

export interface Assumption {
  id: string;
  statement: string;
  linkedEvidenceIds: string[]; // Tracing assumption to evidence
}

export interface Risk {
  id: string;
  statement: string;
}

export interface Counterargument {
  id: string;
  statement: string;
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  strength: 'weak' | 'moderate' | 'strong';
  status: 'open' | 'addressed' | 'fatal';
}

export interface Hypothesis {
  id: string;
  questionId: string;
  statement: string;
  status: HypothesisStatus;
  
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  evidenceGaps: string[];
  
  assumptions: Assumption[];
  risks: Risk[];
  counterarguments: Counterargument[];
  
  confidence: ExplainableConfidence;
  confidenceExplanation: string; // The "why" behind the confidence
  
  createdAt: string;
  updatedAt: string;
}

export interface QuestionDependency {
  id: string;
  parentQuestionId: string;
  childQuestionId: string;
}

export interface Question {
  id: string;
  projectId: string;
  text: string;
  category: QuestionCategory;
  priority: QuestionPriority;
  status: QuestionStatus;
  analystPosition?: string; // Summary of current view based on evaluated hypotheses
  createdAt: string;
}
