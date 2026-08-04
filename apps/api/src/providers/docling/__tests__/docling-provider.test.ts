import { DoclingProvider } from "../DoclingProvider";
import { ProviderContext } from "../../base/ProviderContext";
import { DoclingConfiguration } from "../DoclingConfiguration";

describe("DoclingProvider Integration", () => {
  let provider: DoclingProvider;
  
  const mockConfig: DoclingConfiguration = {
    providerId: "docling",
    version: "2.0.0",
    timeoutMs: 30000,
    maxRetries: 1,
    processingProfile: "standard",
    debugMode: true, // Uses mock parser in python to avoid ML model loading overhead
    language: "en",
    ocrEnabled: false,
    maxPages: 10,
    chunkStrategy: "structural",
    extractTables: true,
    extractImages: false,
    extractFigures: false,
    extractCaptions: false,
    readingOrder: "natural"
  };

  beforeAll(async () => {
    provider = new DoclingProvider();
    await provider.initialize(mockConfig);
  });

  afterAll(async () => {
    await provider.shutdown();
  });

  it("should initialize successfully and report healthy", async () => {
    const health = await provider.health();
    expect(health.status).toBe("Healthy");
  });

  it("should parse a PDF and return deterministic structural artifacts", async () => {
    const context: ProviderContext = {
      workflowId: "test-doc-1",
      stageId: "parse-1",
      engineContext: {} as any
    };

    const inputs = [{
      id: "art-1",
      type: "raw_pdf",
      payload: { filepath: "test.pdf" },
      provenance: { producerStage: "sys", provider: "sys", pipelineId: "sys", version: 1, timestamp: "now" }
    }];

    const result = await provider.execute(inputs, context);

    // 1 DocumentStructure, + multiple TextChunks depending on mock items
    expect(result.artifacts.length).toBeGreaterThan(1);
    
    const structure = result.artifacts.find(a => a.type === "DocumentStructure");
    expect(structure).toBeDefined();
    expect(structure?.payload.title).toBe("Mock PDF Title");

    const chunks = result.artifacts.filter(a => a.type === "TextChunk");
    expect(chunks.length).toBeGreaterThan(0);
    
    // Chunk IDs should be deterministic hashes
    const chunk1 = chunks[0];
    expect(chunk1.id).toMatch(/^[a-f0-9]{64}$/); // SHA-256
    
    // Provenance must be stamped
    expect(chunk1.provenance?.provider).toBe("docling");
    expect(chunk1.provenance?.pipelineId).toBe("test-doc-1");
  });
});
