import { ICReviewProvider } from "../ICReviewProvider";
import { ProviderContext } from "../../base/ProviderContext";

describe("IC Review Engine", () => {
  let provider: ICReviewProvider;

  beforeAll(async () => {
    provider = new ICReviewProvider();
    await provider.initialize({ providerId: "ic_review", version: "1.0", timeoutMs: 1000, maxRetries: 0, processingProfile: "standard", debugMode: false });
  });

  it("should generate adversarial reviews with counterarguments and diligence gaps", async () => {
    const evidenceCatalog = {
      type: "EvidenceCatalog",
      payload: {
        "GROWTH_STATEMENT": [
          { id: "ev_1", statement: "Revenue grew 18%", category: "Financial" },
          { id: "ev_2", statement: "Customer churn increased by 5%", category: "Risk" }
        ]
      }
    };

    const hypothesis = {
      type: "HypothesisProposal",
      payload: {
        id: "hyp_123",
        title: "Strong Growth Narrative",
        description: "Company is growing rapidly without issue.",
        supportingEvidenceIds: ["ev_1"],
        contradictingEvidenceIds: [],
        assumptions: [],
        risks: [],
        missingEvidence: []
      }
    };

    const context: ProviderContext = {
      workflowId: "wf1",
      stageId: "ic-stage-1",
      engineContext: {} as any
    };

    const result = await provider.execute([hypothesis as any, evidenceCatalog as any], context);

    const proposals = result.artifacts.filter(a => a.type === "ICReviewProposal");
    const counterArguments = result.artifacts.filter(a => a.type === "CounterArgument");
    const gaps = result.artifacts.filter(a => a.type === "DiligenceGap");
    const trace = result.artifacts.find(a => a.type === "ReviewTrace");

    expect(proposals.length).toBe(1);
    const review = proposals[0].payload;
    
    // The LLM Mock is programmed to identify the uncited evidence (ev_2) and formulate a counterargument
    expect(review.hypothesisId).toBe("hyp_123");
    expect(review.computedReviewStrength).toBeDefined();
    expect(review.residualRisk).toBeDefined();

    expect(counterArguments.length).toBe(1);
    expect(counterArguments[0].payload.contradictingEvidenceIds).toContain("ev_2"); // Successfully found the hallucination-free counter-evidence

    expect(gaps.length).toBe(1);
    
    // Provenance
    expect(proposals[0].provenance?.provider).toBe("ic-review-llm");
    
    // Reasoning Trace
    expect(trace).toBeDefined();
    expect(trace?.payload.validationResults.passed).toBe(true);
  });
});
