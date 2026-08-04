export type KnowledgeAssetType = 'insight' | 'narrative' | 'evidence' | 'principle';
export type KnowledgeFreshness = 'fresh' | 'current' | 'needs_review' | 'stale' | 'deprecated';

export interface TaxonomyNode {
  id: string;
  name: string;
  parentId: string | null;
  childrenIds: string[];
}

export interface KnowledgeConfidence {
  numberOfUses: number;
  successfulValidations: number;
  contradictions: number;
  lastReviewed: string;
}

export interface KnowledgeUsage {
  id: string;
  knowledgeAssetId: string;
  reusingProjectId: string;
  userId: string;
  timestamp: string;
  context: string;
}

export interface Challenge {
  id: string;
  knowledgeAssetId: string;
  projectId: string;
  contradictingEvidenceId?: string;
  contradictingInsightId?: string;
  resolution?: 'upheld' | 'refined' | 'deprecated';
  resolutionNotes?: string;
}

export interface InstitutionalPrinciple {
  id: string;
  sourceInsightId: string;
  originProjectId: string;
  statement: string;
  status: 'active' | 'under_review' | 'archived';
  reviewSchedule: string;
}

export interface ReuseGraph {
  originProjectId: string;
  derivedPrincipleId?: string;
  projectsReusedIn: string[]; // List of project IDs where this has been used
}

export interface KnowledgeAsset {
  id: string;
  type: KnowledgeAssetType;
  sourceId: string;
  taxonomyNodeId: string;
  title: string;
  summary: string;
  
  isPinned: boolean;
  
  confidence: KnowledgeConfidence;
  freshness: KnowledgeFreshness;
  reuseGraph: ReuseGraph;
}
