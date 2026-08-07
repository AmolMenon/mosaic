# API Documentation

The Mosaic OS REST API allows enterprise customers to programmatically trigger intelligence pipelines.

## Authentication
All API requests require a Bearer token in the Authorization header. Generate a token via your account settings.
`Authorization: Bearer <your_jwt_token>`

## Endpoints

### `POST /api/v1/projects`
Create a new diligence project.

### `POST /api/v1/projects/:id/documents`
Upload a document to a project for processing.

### `POST /api/v1/executions`
Trigger an AI orchestration pipeline on a project.

### `GET /api/v1/executions/:id`
Poll for the status of a running execution.
