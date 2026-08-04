# Mosaic Architecture Constitution

As approved by the Staff Engineering review, this document is the immutable architectural foundation of the Mosaic repository.

## 1. Modular Monolith
Mosaic is composed of two primary application boundaries:
- `apps/web`: Next.js 15 (Frontend Monolith)
- `apps/api`: FastAPI (Backend Monolith)

We do not use microservices. Both monolithic applications scale horizontally independently.

## 2. Strict Domain-Driven Design (DDD)
The codebase is organized by business domain, not technical layer.
Domains include: `documents`, `questions`, `evidence`, `memo`, `projects`, `companies`.

Each domain strictly owns its components, types, hooks, services, and validation schemas.

## 3. Dependency Rules
Dependencies must only flow downward. Sideways or upward dependencies are strictly forbidden and will fail CI.

**Hierarchy (Top to Bottom):**
1. Memo
2. Questions
3. Evidence
4. Documents
5. Projects/Companies

## 4. Shared Packages (`packages/`)
- `contracts`: **Only** API interfaces and DTOs. Used by both frontend and backend to enforce schema parity.
- `ui`: Obsidian Design System. Absolutely no business logic.
- `core`: Utilities and cross-domain logic.
- `testing`: Shared mocks and fixtures.

## 5. Backend Conventions
- **Database**: PostgreSQL (pgvector). The Evidence Graph is modeled relationally.
- **AI**: Abstracted as an infrastructure detail.
- **Observability**: Structured logging inside `/observability`.
