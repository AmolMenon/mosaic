-- Execution Indexes
CREATE INDEX idx_executions_pipeline_id ON executions(pipeline_id);
CREATE INDEX idx_executions_document_id ON executions(document_id);
CREATE INDEX idx_executions_status ON executions(status);

-- Artifact Indexes
CREATE INDEX idx_artifacts_execution_id ON pipeline_artifacts(execution_id);
CREATE INDEX idx_artifacts_document_id ON pipeline_artifacts(document_id);
CREATE INDEX idx_artifacts_type ON pipeline_artifacts(artifact_type);
CREATE INDEX idx_artifacts_provider_id ON pipeline_artifacts(provider_id);
CREATE INDEX idx_artifacts_created_at ON pipeline_artifacts(created_at);

-- Checkpoint Indexes
CREATE INDEX idx_checkpoints_execution_id ON checkpoints(execution_id);
CREATE INDEX idx_checkpoints_created_at ON checkpoints(created_at);

-- Proposal Indexes
CREATE INDEX idx_proposals_execution_id ON proposals(execution_id);
CREATE INDEX idx_proposals_type ON proposals(proposal_type);

-- Metrics Indexes
CREATE INDEX idx_metrics_execution_id ON execution_metrics(execution_id);
