# Security FAQ for Enterprise Procurement

When deploying AI across highly confidential investment data, security is the primary concern. Here is how Mosaic OS addresses standard InfoSec objections.

**Q: Will our data be used to train your models?**
**A:** No. We utilize zero-retention Enterprise API endpoints for all our LLM providers (OpenAI, Anthropic, Google). Your data is never used to train foundation models, and it is not retained on their servers beyond the duration of the API request.

**Q: Where is data stored?**
**A:** Data is stored in our SOC2 compliant AWS infrastructure. All data at rest is encrypted using AES-256 via AWS KMS. Data in transit is encrypted using TLS 1.3.

**Q: Can other customers see our data?**
**A:** Absolutely not. We employ strict row-level security (RLS) policies within our PostgreSQL database. Every query requires a valid Organization ID bound to the authenticated user's JWT token.

**Q: Do you offer single-tenant or on-premise deployments?**
**A:** We do not offer on-premise deployments due to the rapidly evolving nature of our orchestration engine. However, for our Enterprise Tier customers, we offer Dedicated VPC Peering (AWS PrivateLink), ensuring network isolation.

**Q: What happens if an employee leaves?**
**A:** Mosaic OS integrates directly with your Identity Provider (IdP) via SAML 2.0 (Okta, Entra ID). When an employee is offboarded in your HRIS, their access to Mosaic OS is instantly revoked.

**Q: How do you handle vulnerabilities?**
**A:** Our codebase undergoes continuous automated dependency scanning via Snyk, and we conduct annual third-party penetration testing. We also maintain a responsible disclosure bug bounty program.
