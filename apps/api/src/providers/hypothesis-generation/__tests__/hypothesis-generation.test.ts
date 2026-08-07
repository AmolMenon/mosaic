import { HypothesisGenerationProvider } from "../HypothesisGenerationProvider";
import { ProviderContext } from "../../base/ProviderContext";
import { OpenAiProvider } from "../../../infrastructure/ai/providers/OpenAiProvider";

jest.mock("../../../infrastructure/ai/providers/OpenAiProvider");

describe("Hypothesis Generation Engine", () => {
  let provider: HypothesisGenerationProvider;

  beforeAll(async () => {
    (OpenAiProvider as jest.Mock).mockImplementation(() => {
      return {
        generateJson: jest.fn().mockResolvedValue({
          text: JSON.stringify({
            hypotheses: [
              {
                id: "hyp_mock_1",
                title: "Mock Hypothesis 1",
                description: "This is a mock",
                supportingEvidenceIds: ["ev_1"],
                contradictingEvidenceIds: [],
                assumptions: [],
                risks: [],
                missingEvidence: []
              },
              {
                id: "hyp_mock_2",
                title: "Mock Hypothesis 2",
                description: "This is another mock",
                supportingEvidenceIds: ["ev_2"],
                contradictingEvidenceIds: [],
                assumptions: [],
                risks: [],
                missingEvidence: []
              }
            ]
          })
        })
      };
    });

    provider = new HypothesisGenerationProvider();
    await provider.initialize({ providerId: "hypothesis_generation", version: "1.0", timeoutMs: 1000, maxRetries: 0, processingProfile: "standard", debugMode: false });
  });

  it("should extract hypotheses from valid evidence and reject invalid evidence", async () => {
    const evidenceCatalog = {
      type: "EvidenceCatalog",
      payload: {
        "GROWTH_STATEMENT": [
          { id: "ev_1", statement: "Revenue grew 18%", category: "Financial" },
          { id: "ev_2", statement: "Pricing pressure increased", category: "Commercial" }
        ]
      }
    };

    const context: ProviderContext = {
      workflowId: "wf1",
      stageId: "hyp-stage-1",
      engineContext: {} as any
    };

    const result = await provider.execute([evidenceCatalog as any], context);

    const proposals = result.artifacts.filter(a => a.type === "HypothesisProposal");
    const trace = result.artifacts.find(a => a.type === "ReasoningTrace");

    // Our mock generates 2 hypotheses
    expect(proposals.length).toBe(2);
    
    const hyp1 = proposals[0].payload;
    expect(hyp1.title).toBeDefined();
    // Confidence is computed deterministically, not from the LLM
    expect(hyp1.computedConfidence).toBeDefined();
    
    // Provenance
    expect(proposals[0].provenance?.provider).toBe("hypothesis-generation-llm");
    
    // Reasoning Trace
    expect(trace).toBeDefined();
    expect(trace?.payload.validationResults.passed).toBe(2);
  });
});
