import { ProviderFactory } from "../base/ProviderFactory";
import { ProviderRegistry } from "../base/ProviderRegistry";
import { MockOCRProvider } from "../mock/MockOCRProvider";
import { MockEntityProvider } from "../mock/MockEntityProvider";
import { ConfigurationError, ProviderNotFound } from "../base/ProviderErrors";

describe("Document Processing Provider Framework", () => {
  let factory: ProviderFactory;
  let registry: ProviderRegistry;

  beforeEach(() => {
    factory = new ProviderFactory();
    factory.registerConstructor("mock_ocr", MockOCRProvider);
    factory.registerConstructor("mock_entity", MockEntityProvider);
    
    registry = new ProviderRegistry();
  });

  it("should dynamically resolve and initialize a provider via the Factory", async () => {
    const provider = await factory.create({
      providerId: "mock_ocr",
      version: "1.0",
      timeoutMs: 5000,
      maxRetries: 3,
      processingProfile: "standard",
      debugMode: false
    });

    expect(provider).toBeInstanceOf(MockOCRProvider);
    
    const health = await provider.health();
    expect(health.status).toBe("Healthy");
  });

  it("should reject unknown provider configurations", async () => {
    await expect(factory.create({
      providerId: "unknown_provider",
      version: "1.0",
      timeoutMs: 5000,
      maxRetries: 3,
      processingProfile: "standard",
      debugMode: false
    })).rejects.toThrow(ConfigurationError);
  });

  it("should successfully execute a provider contract", async () => {
    const provider = await factory.create({
      providerId: "mock_entity",
      version: "1.0",
      timeoutMs: 5000,
      maxRetries: 3,
      processingProfile: "standard",
      debugMode: false
    });

    // Mock an input artifact from the execution engine
    const inputArtifacts = [{
      id: "art_1",
      type: "chunks",
      payload: { chunks: ["Text"] },
      provenance: { producerStage: "s1", provider: "p1", pipelineId: "wf1", version: 1, timestamp: "now" }
    }];

    const context = { workflowId: "wf1", stageId: "s2", engineContext: {} as any };

    const result = await provider.execute(inputArtifacts, context);

    expect(result.artifacts.length).toBe(1);
    expect(result.artifacts[0].type).toBe("extracted_entities");
    expect(result.artifacts[0].payload.entities.length).toBe(2);
    
    expect(result.metrics.executionCount).toBe(1);
  });

  it("should throw if the provider registry fails to resolve", () => {
    expect(() => registry.resolve("missing_provider")).toThrow(ProviderNotFound);
  });
});
