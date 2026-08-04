# Contributing to Mosaic OS

## Branch Strategy
- `main` is protected and deployable.
- Feature branches should follow `feature/issue-id-description`.

## Commit Conventions
Follow Conventional Commits (e.g., `feat:`, `fix:`, `chore:`).

## PR Process
1. Open a PR against `main`.
2. Ensure CI passes (lint, test, build).
3. Require at least one approving review.

## Code Style
Use Prettier and ESLint. Run `npm run lint` before committing.

## Testing Requirements
All new features must include unit tests and E2E coverage where applicable.
