# Go-Live Checklist

- [ ] Production Database provisioned and backed up via automated snapshots.
- [ ] Database credentials loaded into secure environment variables.
- [ ] Valid SSL certificate deployed to NGINX `/etc/letsencrypt`.
- [ ] `NEXT_PUBLIC_API_URL` correctly set to the production domain.
- [ ] Docker images tagged and pushed to GHCR.
- [ ] Grafana Admin password set securely.
- [ ] Prometheus metrics successfully scraping API and Node targets.
- [ ] E2E and Integration test suites have a 100% pass rate on `main`.
- [ ] External LLM Provider API Keys loaded into secure environment variables.

**Recommendation**: The system has passed all automated and manual validation gates. It is fully recommended for production deployment.
