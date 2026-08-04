import { EntityExtractionProvider } from "../EntityExtractionProvider";
import { ProviderContext } from "../../base/ProviderContext";
import { ProviderConfiguration } from "../../base/ProviderConfiguration";

describe("Entity Extraction Engine", () => {
  let provider: EntityExtractionProvider;

  beforeAll(async () => {
    provider = new EntityExtractionProvider();
    await provider.initialize({ providerId: "entity_extraction", version: "1.0", timeoutMs: 1000, maxRetries: 0, processingProfile: "standard", debugMode: false });
  });

  it("should extract entities, resolve deduplicates, and emit catalog", async () => {
    const chunk1 = {
      id: "chunk-1",
      type: "TextChunk",
      payload: { text: "L Catterton Partners announced a 15% growth." },
      provenance: { producerStage: "sys", provider: "docling", pipelineId: "wf1", version: 1, timestamp: "now" }
    };

    const chunk2 = {
      id: "chunk-2",
      type: "TextChunk",
      payload: { text: "LC expects this to continue." },
      provenance: { producerStage: "sys", provider: "docling", pipelineId: "wf1", version: 1, timestamp: "now" }
    };

    const context: ProviderContext = {
      workflowId: "wf1",
      stageId: "entity-stage-1",
      engineContext: {} as any
    };

    const result = await provider.execute([chunk1, chunk2], context);

    // Filter artifacts by type
    const entities = result.artifacts.filter(a => a.type === "Entity");
    const mentions = result.artifacts.filter(a => a.type === "EntityMention");
    const relationships = result.artifacts.filter(a => a.type === "EntityRelationship");
    const catalogs = result.artifacts.filter(a => a.type === "EntityCatalog");

    // L Catterton Partners and LC should resolve to "L Catterton"
    const company = entities.find(e => e.payload.type === "Company");
    expect(company).toBeDefined();
    expect(company?.payload.canonicalName).toBe("L Catterton");
    
    // There should be two mentions of this company
    const companyMentions = mentions.filter(m => m.payload.entityId === company?.payload.id);
    expect(companyMentions.length).toBe(2);

    // 15% should be extracted
    const perc = entities.find(e => e.payload.type === "Percentage");
    expect(perc).toBeDefined();

    // Relationships: MetricMeasuredInPercentageRule should connect Company to Percentage
    expect(relationships.length).toBeGreaterThan(0);
    expect(relationships[0].payload.sourceEntityId).toBe(company?.payload.id);
    expect(relationships[0].payload.targetEntityId).toBe(perc?.payload.id);

    // Catalog should group by type
    expect(catalogs.length).toBe(1);
    expect(catalogs[0].payload.Company).toBeDefined();
    expect(catalogs[0].payload.Company[0].name).toBe("L Catterton");
  });
});
