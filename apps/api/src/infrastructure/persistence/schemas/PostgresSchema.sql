CREATE TABLE executions (
    execution_id VARCHAR(255) PRIMARY KEY,
    pipeline_id VARCHAR(255) NOT NOLL,
    document_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    progress_state VARCHAR(100) NOT NULL,
    version INTEGER NOT NULL DEFAULT 1, -- Optimistic concurrency
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE pipeline_artifacts (
    artifact_id VARCHAR(255) PRIMARY KEY,
    execution_id VARCHAR(255) NOT NULL REFERENCES executions(execution_id),
    document_id VARCHAR(255) NOT NULL,
    artifact_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    producer_stage VARCHAR(255) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    provider_version VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE checkpoints (
    checkpoint_id VARCHAR(255) PRIMARY KEY,
    execution_id VARCHAR(255) NOT NULL REFERENCES executions(execution_id),
    stage_id VARCHAR(255) NOT NULL,
    artifact_ids JSONB NOT NULL, -- Array of artifact IDs
    metrics_snapshot JSONB NOT NULL,
    completed_stages JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE execution_metrics (
    metrics_id SERIAL PRIMARY KEY,
    execution_id VARCHAR(255) NOT NULL REFERENCES executions(execution_id),
    stage_id VARCHAR(255) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    latency_ms INTEGER NOT NULL,
    token_usage INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE proposals (
    proposal_id VARCHAR(255) PRIMARY KEY,
    execution_id VARCHAR(255) NOT NULL REFERENCES executions(execution_id),
    proposal_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
