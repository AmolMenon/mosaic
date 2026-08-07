import { ReasoningOrchestrator } from "../ReasoningOrchestrator";
import { PipelineArtifact } from "@mosaic/contracts";

jest.mock("../../../providers/docling/DoclingProvider", () => ({
  DoclingProvider: jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    execute: jest.fn().mockResolvedValue({ artifacts: [], metrics: {} }),
    validateConfiguration: jest.fn()
  }))
}));
jest.mock("../../../providers/entity-extraction/EntityExtractionProvider", () => ({
  EntityExtractionProvider: jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    execute: jest.fn().mockResolvedValue({ artifacts: [], metrics: {} }),
    validateConfiguration: jest.fn()
  }))
}));
jest.mock("../../../providers/evidence-extraction/EvidenceExtractionProvider", () => ({
  EvidenceExtractionProvider: jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    execute: jest.fn().mockResolvedValue({ artifacts: [], metrics: {} }),
    validateConfiguration: jest.fn()
  }))
}));
jest.mock("../../../providers/hypothesis-generation/HypothesisGenerationProvider", () => ({
  HypothesisGenerationProvider: jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    execute: jest.fn().mockResolvedValue({ artifacts: [], metrics: {} }),
    validateConfiguration: jest.fn()
  }))
}));
jest.mock("../../../providers/ic-review/ICReviewProvider", () => ({
  ICReviewProvider: jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    execute: jest.fn().mockResolvedValue({ artifacts: [], metrics: {} }),
    validateConfiguration: jest.fn()
  }))
}));

describe("Reasoning Orchestrator", () => {
  let orchestrator: ReasoningOrchestrator;

  beforeEach(() => {
    orchestrator = new ReasoningOrchestrator();
  });

  it("should execute a full successful pipeline", async () => {
    const input: any = {
      type: "DocumentInput",
      payload: { id: "doc_1", rawText: "Q3 revenue grew 15%." }
    };

    const summary = await orchestrator.execute("exec_1", "wf_1", [input], false);

    if (!summary.qualityGateResults.passed) console.log(summary.failures);
    expect(summary.qualityGateResults.passed).toBe(true);
    expect(summary.failures.length).toBe(0);
    expect(summary.checkpointCount).toBe(5); // 5 stages
    
    // We expect artifacts from all stages. Let's check some key counts based on mocked providers
    // Entity -> Evidence -> Hypothesis -> IC Review
    expect(summary.artifactsProduced).toBeGreaterThan(0);
    expect(summary.evidenceCount).toBeGreaterThanOrEqual(0);
  });

  it("should recover from a checkpoint when resuming", async () => {
    const input: any = {
      type: "DocumentInput",
      payload: { id: "doc_1", rawText: "Normal text." }
    };

    // Run first execution
    await orchestrator.execute("exec_recovery_test", "wf_2", [input], false);
    
    // Resume same execution (simulate failure and recovery)
    const summary2 = await orchestrator.execute("exec_recovery_test", "wf_2", [input], true);

    expect(summary2.qualityGateResults.passed).toBe(true);
    // Since it recovered, it should skip all 5 stages and finish instantly without adding new checkpoints
    expect(summary2.checkpointCount).toBe(5); 
    expect(summary2.recoveryCount).toBe(1);
  });

  it("should reject invalid inputs", async () => {
    await expect(orchestrator.execute("exec_3", "wf_3", [], false))
      .resolves.toMatchObject({
        qualityGateResults: { passed: false },
        failures: expect.arrayContaining([
          expect.objectContaining({ message: "No input artifacts provided to pipeline." })
        ])
      });
  });
});
