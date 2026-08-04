export type EvidenceRole = 
  | 'SUPPORTS' 
  | 'CONTRADICTS' 
  | 'QUALIFIES' 
  | 'CONTEXT' 
  | 'METRIC' 
  | 'ASSUMPTION' 
  | 'RISK' 
  | 'GAP';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Provenance {
  documentId: string;
  page: number;
  paragraph: number;
  boundingBox: BoundingBox;
  extractionMethod: 'ocr' | 'pdf_text' | 'manual';
  versionId: string;
  importedTimestamp: string;
}

export interface EvidenceVersion {
  id: string;
  documentVersionId: string;
  createdAt: string;
  isValid: boolean;
}

export interface Evidence {
  id: string;
  text: string;
  provenance: Provenance;
}

export interface ClaimEvidenceLink {
  id: string;
  claimId: string;
  evidenceId: string;
  role: EvidenceRole;
  confidence: ConfidenceLevel;
}

export interface Claim {
  id: string;
  insightId: string; // Normalized: links upwards
  statement: string;
}

export interface Insight {
  id: string;
  questionId: string; // Normalized: links upwards
  summary: string;
}

export interface Question {
  id: string;
  projectId: string;
  text: string;
  status: 'open' | 'answered' | 'blocked';
}

// Normalized Data Store format (e.g., how the frontend holds it)
export interface EvidenceGraph {
  questions: Record<string, Question>;
  insights: Record<string, Insight>;
  claims: Record<string, Claim>;
  evidence: Record<string, Evidence>;
  links: Record<string, ClaimEvidenceLink>;
}
