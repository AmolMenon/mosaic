# Rollback Procedure

If a production deployment introduces critical regressions or fails health checks:

## 1. Identify the Previous Stable Tag
Check the Docker registry or Git history for the last known good release tag (e.g. `v1.2.3`).

## 2. Revert Docker Images
In the `.env.prod` file, explicitly pin the image tags instead of using `latest`:
```env
API_IMAGE_TAG=v1.2.3
WEB_IMAGE_TAG=v1.2.3
```

## 3. Redeploy the Stack
Bring the containers down and up with the updated tags:
```bash
docker-compose -f infrastructure/compose/docker-compose.prod.yml down
docker-compose -f infrastructure/compose/docker-compose.prod.yml up -d
```

## 4. Database Rollback
If the deployment included a schema migration that corrupted data, restore the database from the last automated snapshot taken prior to deployment. (Consult the Disaster Recovery runbook for RDS/Postgres snapshot restoration).
