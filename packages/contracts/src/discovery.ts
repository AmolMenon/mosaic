import { KnowledgeFreshness, KnowledgeAssetType } from "./knowledge";
import { InsightStatus } from "./insights";

export interface KnowledgeViewFilters {
  taxonomyIds?: string[];
  freshness?: KnowledgeFreshness[];
  status?: InsightStatus[];
  originProjectId?: string;
  dateRange?: { start: string; end: string };
}

export interface KnowledgeView {
  id: string;
  name: string;
  description: string;
  query: string; // The natural language or keyword discovery intent
  filters: KnowledgeViewFilters;
  isPinned: boolean;
}

export type FollowTargetType = 'taxonomy' | 'principle' | 'insight' | 'challenge';

export interface FollowNode {
  id: string;
  targetId: string;
  targetType: FollowTargetType;
  userId: string;
  subscribedAt: string;
}

export interface ExplainableDiscovery {
  matchedTerm: string;
  matchReason: string; // e.g., "Highly referenced Principle related to 'pricing power'"
  traversedRelationships: string[]; // e.g., "Insight -> Principle -> Narrative"
  supportedPrinciples: string[];
  reusingProjects: string[]; // Project IDs
}

export interface DiscoveryResult {
  id: string;
  assetId: string; // The ID of the underlying knowledge asset
  type: KnowledgeAssetType | 'project' | 'document' | 'question';
  title: string;
  snippet: string;
  explanation: ExplainableDiscovery; // Replaces opaque relevancy scores
}

export interface KnowledgeEvolution {
  assetId: string;
  conceptName: string;
  projectTimeline: {
    projectId: string;
    projectName: string;
    context: string;
    timestamp: string;
  }[];
}
