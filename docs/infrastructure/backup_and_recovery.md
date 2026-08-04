# Backup & Recovery Runbook

## Point-in-Time Recovery (PITR)
- **Mechanism**: PostgreSQL Write-Ahead Logs (WAL) are shipped continuously to S3 using `pgBackRest`.
- **RPO (Recovery Point Objective)**: 5 minutes.
- **RTO (Recovery Time Objective)**: < 1 hour.

## Automated Backups
- Daily full logical backups (pg_dump) are taken at 03:00 UTC.
- Retained in S3 with immutable locks for 30 days to prevent ransomware tampering.

## Restore Verification
- An automated cron job executes a dry-run restore into an ephemeral isolated VPC every Sunday.
- A query validates data integrity of `PipelineArtifacts`.

## Disaster Recovery Documentation
- In the event of a region loss (e.g. us-east-1 goes down), the standby cluster in `us-west-2` is promoted manually.
- The `StorageProvider` (S3) relies on Cross-Region Replication (CRR).
