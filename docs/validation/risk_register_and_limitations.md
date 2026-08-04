# Risk Register & Known Limitations

## Known Limitations
1. **Document Size**: Documents exceeding 50MB will be rejected by the NGINX reverse proxy.
2. **Provider Rate Limits**: Heavy concurrent usage may trigger 429 Too Many Requests from the underlying LLM providers (e.g. OpenAI/Anthropic), pausing the pipeline.
3. **SSE Connection Limits**: Browsers limit the number of active SSE connections per domain to 6. Users opening multiple execution tabs simultaneously may experience degradation to polling.

## Risk Register
1. **Database Bottleneck**: As the `PipelineArtifacts` table grows, read performance may degrade if indexes are not properly maintained. 
   - *Mitigation*: Ensure periodic `VACUUM` and consider table partitioning for historical executions.
2. **Queue Saturation**: If workers crash repeatedly, the execution queue may build up.
   - *Mitigation*: Implement a Dead Letter Queue (DLQ) and Prometheus alerts on queue depth.
