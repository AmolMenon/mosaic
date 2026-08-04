export type SpecialistRole = 
  | 'generalist'
  | 'commercial_dd' 
  | 'market_research' 
  | 'financial_analysis' 
  | 'operating_diligence' 
  | 'portfolio_monitoring';

export type AIAssignmentStatus = 
  | 'planning' 
  | 'running' 
  | 'needs_review' 
  | 'completed' 
  | 'archived';

export type ProposalType = 
  | 'evidence_proposal' 
  | 'hypothesis_proposal' 
  | 'insight_proposal' 
  | 'narrative_proposal' 
  | 'memo_draft_proposal';

export type ProposalStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'accepted' 
  | 'rejected' 
  | 'modified' 
  | 'archived';

export interface AIReasoning {
  whySuggested: string;
  supportingEvidenceIds: string[];
  referencedInsightIds: string[];
  institutionalPrinciples: string[];
  assumptionsMade: string[];
  uncertaintyRemaining: string;
}

export interface Proposal<T> {
  id: string;
  proposalType: ProposalType;
  targetObject: T; 
  reasoning: AIReasoning;
  confidence: number;
  status: ProposalStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AIDeliverable {
  id: string;
  title: string;
  type: string; // e.g., 'Evidence Review', 'Risk Assessment'
  proposals: Proposal<any>[]; // Contains the actual discrete proposed changes
  status: 'generating' | 'ready_for_review' | 'reviewed';
}

export interface AIPlan {
  estimatedSteps: string[];
  expectedOutputs: string[];
  estimatedCompletionMinutes: number;
  status: 'pending_approval' | 'approved';
}

export interface AIAssignment {
  id: string;
  projectId: string;
  specialistRole: SpecialistRole;
  objective: string;
  scope: string; // e.g., "Challenge Narrative on Pricing Power"
  status: AIAssignmentStatus;
  progress: number; // 0-100
  plan?: AIPlan;
  deliverables: AIDeliverable[];
  createdAt: string;
}
