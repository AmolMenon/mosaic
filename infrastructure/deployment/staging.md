# Staging Deployment Guide

Staging runs identical configurations to production, except it connects to a sanitized staging database and runs under a `.staging` domain.

## Steps
1. **Pull RC Branch**: Deploy from the latest release candidate tag or `staging` branch.
2. **Deploy Stack**:
   ```bash
   docker-compose -f infrastructure/compose/docker-compose.prod.yml -p mosaic_staging up -d
   ```
   *(Note: Set the environment variable `NEXT_PUBLIC_API_URL` to the staging URL in your `.env.staging`)*

3. **Verify**: Ensure staging does not connect to the production database via the `/health/ready` endpoint.
