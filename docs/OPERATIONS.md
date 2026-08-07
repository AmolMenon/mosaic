# Operations & Runbook

## Observability
- **Logs**: Backend emits structured JSON logs. Forward stdout to Datadog, ELK, or CloudWatch.
- **Metrics**: OpenTelemetry is the designated standard. Implement `OTLP` exporters in a future sprint for tracing distributed LLM executions.
- **Health Checks**: Container orchestration should poll `/api/v1/health/liveness` and `/api/v1/health/readiness`.

## Backups
- **PostgreSQL**: Configure automated daily snapshots with point-in-time recovery (PITR) up to 35 days.
- **S3 Storage**: Enable object versioning and cross-region replication for disaster recovery.

## Incident Management
If an incident occurs (e.g., API goes down):
1. Check container logs via `docker logs mosaic_api` or your orchestration dashboard.
2. Verify Database connectivity: Ensure the DB is accepting connections and hasn't hit its connection limit.
3. Check AI Provider Outages (OpenAI, Anthropic, Gemini status pages).
4. Roll back to the previous stable Docker image if a recent deployment caused the issue.
