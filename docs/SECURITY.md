# Security Guide

## Threat Model
Mosaic OS processes highly confidential corporate documents and proprietary investment theses. Security is paramount.

- **Data Encryption**: All data is encrypted at rest in PostgreSQL and S3 using KMS keys. Data in transit is encrypted via TLS 1.3.
- **Authentication**: JWT-based stateless authentication validated on every API request via the `requireAuth` middleware.
- **Authorization**: Row-level tenancy enforced at the API layer. Users can only access projects and executions tied to their `organizationId`.

## Protections
- **CORS & Helmet**: Configured strictly on the backend to prevent Cross-Site Scripting (XSS) and enforce Content Security Policies (CSP).
- **Rate Limiting**: `express-rate-limit` mitigates brute force and denial of service (DoS) attacks on API endpoints.
- **Dependency Scanning**: Routine `npm audit` and Snyk checks are enforced in the CI/CD pipeline.

## Responsible Disclosure
If you find a security vulnerability, please do NOT open a public issue. Email security@mosaicos.example.com.
