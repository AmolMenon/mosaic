import { ProviderRegistry } from "../ProviderRegistry";
import { createExecutionContext } from "../ExecutionContext";
import { WorkflowExecutor } from "../WorkflowExecutor";
import { IngestionPipeline, IngestionStage } from "@mosaic/contracts";

import { Database } from "../../infrastructure/persistence/database/Database";

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      const client = {
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        $extends: jest.fn().mockReturnThis(),
        $transaction: async (cb: any) => { await cb(client); },
        execution: {
          findUnique: async (data: any) => {
            return (global as any).__memoryStore.executions.find((e: any) => e.execution_id === data.where.execution_id);
          },
          create: async (data: any) => {
            (global as any).__memoryStore.executions.push(data.data);
          },
          update: async (data: any) => {
            const exec = (global as any).__memoryStore.executions.find((e: any) => e.execution_id === data.where.execution_id);
            if (exec) exec.version++;
          }
        },
        pipelineArtifact: {
          create: async (data: any) => {
            (global as any).__memoryStore.pipeline_artifacts.push(data.data);
          }
        }
      };
      return client;
    })
  };
});

describe("Workflow Execution Engine", () => {
  let providers: ProviderRegistry;
  let mockDb: Database;

  beforeEach(() => {
    (global as any).__memoryStore = { 
      executions: [
        { execution_id: "wf_1", document_id: "doc_1", profile: "fast_review", status: "queued", stages: [], artifacts: [], version: 1 },
        { execution_id: "wf_2", document_id: "doc_1", profile: "fast_review", status: "queued", stages: [], artifacts: [], version: 1 },
        { execution_id: "wf_3", document_id: "doc_1", profile: "fast_review", status: "queued", stages: [], artifacts: [], version: 1 },
        { execution_id: "wf_4", document_id: "doc_1", profile: "fast_review", status: "queued", stages: [], artifacts: [], version: 1 },
        { execution_id: "wf_5", document_id: "doc_1", profile: "fast_review", status: "completed", stages: [], artifacts: [], version: 1 }
      ], 
      pipeline_artifacts: [] 
    };
    mockDb = new Database();
    providers = new ProviderRegistry();
    providers.register("MockOCR", async (inputs) => ({ text: "Parsed text" }));
    providers.register("MockExtraction", async (inputs) => ({ entities: ["Company A"] }));
  });

  const createMockStage = (id: string, inTypes: string[], outTypes: string[], gates: any[] = []): IngestionStage => ({
    id,
    name: `Stage ${id}`,
    contract: { inputArtifactTypes: inTypes, outputArtifactTypes: outTypes },
    status: 'pending',
    retryCount: 0,
    logs: [],
    qualityGates: gates,
    inputArtifactIds: [],
    outputArtifactIds: []
  });

  it("should execute a successful workflow end-to-end", async () => {
    const context = createExecutionContext("wf_1", "doc_1", providers, mockDb);
    const executor = new WorkflowExecutor(context);
    
    // Inject initial artifact manually for stage 1
    const startArtifact = context.artifacts.storeArtifact("raw_pdf", { url: "test.pdf" }, "init", "system", "wf_1");

    const stage1 = createMockStage("s1", ["raw_pdf"], ["raw_text"]);
    stage1.inputArtifactIds = [startArtifact.id];

    const stage2 = createMockStage("s2", ["raw_text"], ["extracted_entities"]);
    
    // Link output of s1 to input of s2 manually (in reality an orchestration layer maps this)
    // For the test, we'll map it dynamically during execution or just mock it since this test is simple
    const pipeline: IngestionPipeline = {
      id: "wf_1",
      documentId: "doc_1",
      profile: "fast_review",
      status: "queued",
      stages: [stage1],
      artifacts: [startArtifact],
      createdAt: "now"
    };

    await executor.execute(pipeline, { s1: "MockOCR" });

    expect(executor.getState()).toBe("Completed");
    expect(stage1.status).toBe("success");
    expect(stage1.outputArtifactIds.length).toBe(1);
    
    const outArt = context.artifacts.getArtifact(stage1.outputArtifactIds[0]);
    expect(outArt.type).toBe("raw_text");
    expect(outArt.payload.text).toBe("Parsed text");
  });

  it("should halt execution if a stage is missing required artifacts", async () => {
    const context = createExecutionContext("wf_2", "doc_2", providers, mockDb);
    const executor = new WorkflowExecutor(context);

    // Stage expects raw_pdf but we don't give it any artifacts
    const stage = createMockStage("s1", ["raw_pdf"], ["raw_text"]);
    
    const pipeline: IngestionPipeline = {
      id: "wf_2",
      documentId: "doc_1",
      profile: "fast_review",
      status: "queued",
      stages: [stage],
      artifacts: [],
      createdAt: "now"
    };

    await expect(executor.execute(pipeline, { s1: "MockOCR" })).rejects.toThrow(/Input contract validation failed/);
    expect(executor.getState()).toBe("Failed");
    expect(stage.status).toBe("pending"); // Failed before executing provider
  });

  it("should pause execution if a quality gate fails with pause_for_human", async () => {
    const context = createExecutionContext("wf_3", "doc_3", providers, mockDb);
    const executor = new WorkflowExecutor(context);
    
    const startArtifact = context.artifacts.storeArtifact("raw_pdf", { url: "test.pdf" }, "init", "system", "wf_3");

    const gate = { metric: "confidence", threshold: 0.9, actualValue: 0.5, actionOnFailure: "pause_for_human" };
    const stage = createMockStage("s1", ["raw_pdf"], ["raw_text"], [gate]);
    stage.inputArtifactIds = [startArtifact.id];

    const pipeline: IngestionPipeline = {
      id: "wf_3",
      documentId: "doc_1",
      profile: "fast_review",
      status: "queued",
      stages: [stage],
      artifacts: [startArtifact],
      createdAt: "now"
    };

    await executor.execute(pipeline, { s1: "MockOCR" });

    expect(executor.getState()).toBe("WaitingForHuman");
    expect(stage.status).toBe("awaiting_human");
    // Should still produce the artifact for human review
    expect(stage.outputArtifactIds.length).toBe(1);
  });

  it("should fail pipeline if a quality gate fails with fail_pipeline", async () => {
    const context = createExecutionContext("wf_4", "doc_4", providers, mockDb);
    const executor = new WorkflowExecutor(context);
    
    const startArtifact = context.artifacts.storeArtifact("raw_pdf", { url: "test.pdf" }, "init", "system", "wf_4");

    const gate = { metric: "confidence", threshold: 0.9, actualValue: 0.5, actionOnFailure: "fail_pipeline" };
    const stage = createMockStage("s1", ["raw_pdf"], ["raw_text"], [gate]);
    stage.inputArtifactIds = [startArtifact.id];

    const pipeline: IngestionPipeline = {
      id: "wf_4",
      documentId: "doc_1",
      profile: "fast_review",
      status: "queued",
      stages: [stage],
      artifacts: [startArtifact],
      createdAt: "now"
    };

    await expect(executor.execute(pipeline, { s1: "MockOCR" })).rejects.toThrow(/Quality gate failed/);
    expect(executor.getState()).toBe("Failed");
  });

  it("should throw on illegal state transitions", () => {
    const context = createExecutionContext("wf_5", "doc_5", providers, mockDb);
    const executor = new WorkflowExecutor(context);
    
    // Engine is Queued on creation. Cannot resume.
    expect(() => executor.resume()).toThrow(/Cannot resume from state Queued/);
  });
});
