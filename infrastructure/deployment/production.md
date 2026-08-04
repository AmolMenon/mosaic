# Production Deployment Guide

## Prerequisites
- Docker & Docker Compose installed.
- Valid SSL certificates stored in `/etc/letsencrypt`.
- PostgreSQL database provisioned or accessible.
- Environment variables populated in `.env.prod` from `.env.example`.

## Steps
1. **Pull Latest Code**: Clone or pull the `main` branch.
2. **Build Images**:
   ```bash
   docker-compose -f infrastructure/compose/docker-compose.prod.yml build
   ```
3. **Run Migrations** (if applicable):
   ```bash
   docker-compose -f infrastructure/compose/docker-compose.prod.yml run --rm api npm run db:migrate
   ```
4. **Deploy Stack**:
   ```bash
   docker-compose -f infrastructure/compose/docker-compose.prod.yml up -d
   ```
5. **Verify Health**:
   - Check `https://api.yourdomain.com/v1/health/live`
   - Check `https://api.yourdomain.com/v1/health/ready`

## Monitoring
Grafana is available at `port 3002`. Dashboards for API Latency, Queue Depth, and Node Metrics are pre-configured.

## Scaling
To scale the worker pool:
```bash
docker-compose -f infrastructure/compose/docker-compose.prod.yml up -d --scale worker=3
```
