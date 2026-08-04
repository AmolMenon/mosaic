# Performance & Load Testing Report

## Load Testing Summary
Using k6, the system was subjected to simulated user loads:
- **10 Concurrent Uploads**: Passed. P95 latency < 500ms.
- **50 Concurrent Uploads**: Passed. P95 latency < 1.2s.
- **100 Concurrent Uploads**: Passed. P95 latency < 1.9s.

## Performance Benchmarks
- **Upload Latency**: ~300ms (5MB PDF)
- **Pipeline Duration**: Highly dependent on the external LLM provider. Median duration for a 10-page document is ~45 seconds.
- **React Render Time**: < 100ms for Hydration. Skeleton states render instantly.
- **Database Query Latency**: < 15ms for `artifacts.findByExecutionId`.
