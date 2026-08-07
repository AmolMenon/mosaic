# Deployment Guide

Mosaic OS is containerized and ready for orchestration environments like Kubernetes or Docker Swarm.

## Prerequisites
- Docker Engine & Docker Compose
- PostgreSQL 15+ (if running externally)
- AWS S3 bucket (or compatible object storage)
- LLM Provider API Keys (OpenAI, Anthropic, Gemini)

## Quick Start (Docker Compose)
1. Copy `.env.example` to `.env` and fill in the required variables.
2. Run `docker-compose up --build -d`
3. The API will be available at `http://localhost:3001` and the Web UI at `http://localhost:3000`.

## Production Hardening
- Use a managed database service (e.g., AWS RDS).
- Put both services behind a reverse proxy/load balancer (e.g., Nginx, ALB) and enforce HTTPS.
- Use a secret manager (AWS Secrets Manager, HashiCorp Vault) to inject environment variables securely at runtime.
