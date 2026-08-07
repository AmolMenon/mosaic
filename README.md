# Mosaic OS

## Project Overview
Mosaic OS is an enterprise-grade platform designed for automated investment committee reviews, hypotheses generation, and commercial diligence. It operates on a robust, strictly bounded architecture providing seamless integration with major commercial AI providers.

## Tech Stack
- **Frontend**: Next.js, React Query, Zustand, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Infrastructure**: Docker, NGINX, Prometheus, Grafana

## Monorepo Structure
- `apps/api`: Backend Express server and orchestration engine.
- `apps/web`: Next.js frontend application.
- `packages/contracts`: Shared domain models and interfaces.
- `infrastructure/`: Docker Compose, NGINX, and deployment configuration.

## Installation & Local Development
1. Clone the repository.
2. Run `pnpm install`.
3. Copy `.env.example` to `.env` and fill in required values (do not commit secrets).
4. Run `pnpm run dev` to start the local development server.

## Docker & Deployment
Mosaic is fully containerized. Use `docker-compose -f infrastructure/docker-compose.prod.yml up -d` for production deployments.

## High-Level Reasoning Pipeline
Document Ingestion -> Entity Extraction -> Evidence Extraction -> Hypothesis Generation -> IC Review.

## AI Provider Integration & Gemini
Mosaic uses a centralized `ProviderRegistry` to abstract AI interactions. 
- **Gemini**: Integrated via the `@google/genai` SDK as a core provider.
- **Failover Strategy**: Supports seamless fallback between Anthropic, OpenAI, and Gemini.
- **Prompt Management**: Centralized prompt templates to eliminate prompt drift.

## License
MIT License. See LICENSE file for details.
