# Analytics & Telemetry Strategy

To ensure product-market fit (PMF) and optimize the AI pipelines, Mosaic OS tracks the following core metrics via PostHog / Mixpanel.

## Activation Metrics
- **Time to First Value (TTFV)**: The time elapsed between user signup and the successful generation of their first IC Memo. *Target: < 15 minutes.*
- **Workspace Activation Rate**: Percentage of new signups who create a workspace and upload at least one document.

## Engagement & Retention Metrics
- **Weekly Active Workspaces (WAW)**: Number of workspaces with active document uploads or orchestrator runs per week.
- **Memo Regeneration Rate**: How often users edit constraints and re-trigger memo generation. High rates indicate they value the output but are refining the inputs.
- **D30 Retention**: Percentage of users still executing pipelines 30 days post-signup.

## AI Usage & Latency
- **Cost per Execution**: Aggregate token cost (GPT-4o + Claude) per document processed.
- **Extraction Latency**: P50 and P99 latency for the `EntityExtractionProvider` and `ReasoningOrchestrator`.
- **Pipeline Failure Rate**: Percentage of executions that crash or hit token limits, requiring intervention.
