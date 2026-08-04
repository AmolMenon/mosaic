import { ArgumentStrength } from "./narrative";

export type RenderingProfile = 
  | 'executive' 
  | 'investment_committee' 
  | 'partner' 
  | 'board' 
  | 'lp' 
  | 'management';

export type PublicationReadiness = 
  | 'ready' 
  | 'needs_review' 
  | 'missing_narrative' 
  | 'outstanding_risks' 
  | 'missing_validation';

export type MemoBlockSourceType = 
  | 'narrative_section' 
  | 'argument_block' 
  | 'insight' 
  | 'institutional_principle';

export interface MemoBlock {
  id: string;
  sourceType: MemoBlockSourceType;
  sourceId: string;
  renderedText: string; // The presentation layer derived from the source
  evidenceStrength: ArgumentStrength; // For the Traceability Heatmap
  readiness: PublicationReadiness;
}

export interface MemoSection {
  id: string;
  title: string;
  order: number;
  blocks: MemoBlock[];
}

export interface KnowledgeDiff {
  addedInsights: string[]; // Insight IDs
  removedNarratives: string[]; // Narrative IDs
  changedRisks: string[]; // Risk IDs
  changedAssumptions: string[]; // Assumption IDs
  confidenceDelta: number; // e.g., +1, -1 based on validation strength shifts
}

export interface MemoVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  authorId: string;
  knowledgeDiffFromPrevious?: KnowledgeDiff;
}

export interface Memo {
  id: string;
  projectId: string;
  title: string;
  renderingProfile: RenderingProfile;
  sections: MemoSection[];
  currentVersion: MemoVersion;
  readiness: PublicationReadiness;
}
