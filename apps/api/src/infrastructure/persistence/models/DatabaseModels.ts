// Database Models (Direct mapping to tables)

export interface DbExecution {
  execution_id: string;
  pipeline_id: string;
  document_id: string;
  status: string;
  progress_state: string;
  version: number;
  started_at: Date;
  completed_at: Date | null;
}

export interface DbPipelineArtifact {
  artifact_id: string;
  execution_id: string;
  document_id: string;
  artifact_type: string;
  payload: any;
  producer_stage: string;
  provider_id: string;
  provider_version: string;
  created_at: Date;
}

export interface DbCheckpoint {
  checkpoint_id: string;
  execution_id: string;
  stage_id: string;
  artifact_ids: string[];
  metrics_snapshot: any;
  completed_stages: string[];
  created_at: Date;
}

export interface DbExecutionMetric {
  metrics_id?: number;
  execution_id: string;
  stage_id: string;
  provider_id: string;
  latency_ms: number;
  token_usage: number;
  created_at?: Date;
}

export interface DbProposal {
  proposal_id: string;
  execution_id: string;
  proposal_type: string;
  payload: any;
  created_at: Date;
}
