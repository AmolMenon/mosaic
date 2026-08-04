export type IngestionProcessingProfile = 
  | 'fast_review' 
  | 'commercial_dd' 
  | 'deep_diligence' 
  | 'portfolio_monitoring';

export type PipelineStatus = 'queued' | 'running' | 'paused' | 'failed' | 'completed';
export type StageStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped' | 'awaiting_human';

export interface ArtifactProvenance {
  producerStage: string;
  provider: string; // e.g., 'AWS_Textract', 'Anthropic_Claude_3', 'Human'
  pipelineId: string;
  version: number;
  timestamp: string;
}

export interface PipelineArtifact {
  id: string;
  type: string; // e.g., 'raw_text', 'bounding_boxes', 'extracted_entities', 'candidate_proposals'
  payload: any; // The actual data
  provenance: ArtifactProvenance;
}

export interface StageContract {
  inputArtifactTypes: string[];
  outputArtifactTypes: string[];
}

export interface QualityGate {
  metric: string;
  threshold: number;
  actualValue?: number;
  passed?: boolean;
  actionOnFailure: 'pause_for_human' | 'fail_pipeline' | 'warn_only';
}

export interface StageLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface IngestionStage {
  id: string;
  name: string; // e.g., "Layout Detection", "Human Review"
  contract: StageContract;
  status: StageStatus;
  startTime?: string;
  endTime?: string;
  retryCount: number;
  logs: StageLog[];
  qualityGates: QualityGate[];
  inputArtifactIds: string[];
  outputArtifactIds: string[];
}

export interface IngestionPipeline {
  id: string;
  documentId: string;
  profile: IngestionProcessingProfile;
  status: PipelineStatus;
  stages: IngestionStage[]; // Directed workflow steps
  artifacts: PipelineArtifact[]; // Registry of all artifacts produced during this run
  createdAt: string;
}
