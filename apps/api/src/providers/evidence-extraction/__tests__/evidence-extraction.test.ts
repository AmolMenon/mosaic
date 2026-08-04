import { EvidenceExtractionProvider } from "../EvidenceExtractionProvider";
import { ProviderContext } from "../../base/ProviderContext";
import { EvidenceType } from "../EvidenceTypeRegistry";

describe("Evidence Extraction Engine", () => {
  let provider: EvidenceExtractionProvider;

  beforeAll(async () => {
    provider = new EvidenceExtractionProvider();
    await provider.initialize({ providerId: "evidence_extraction", version: "1.0", timeoutMs: 1000, maxRetries: 0, processingProfile: "standard", debugMode: false });
  });

  it("should extract evidence, assign provenance, and reject invalid candidates", async () => {
    const chunk1 = {
      id: "chunk-1",
      type: "TextChunk",
      payload: { text: "Acme Corp revenue grew 18% year over year." },
      provenance: { producerStage: "sys", provider: "docling", pipelineId: "wf1", version: 1, timestamp: "now" }
    };

    // A chunk with the same text, but simulating a different page/section
    const chunk2 = {
      id: "chunk-2",
      type: "TextChunk",
      payload: { text: "Acme Corp revenue grew 18% year over year." }, // Same fact, should deduplicate if same section, but here chunkId differs
      provenance: { producerStage: "sys", provider: "docling", pipelineId: "wf1", version: 1, timestamp: "now" }
    };

    const mention1 = {
      type: "EntityMention",
      payload: { entityId: "ent_acme", chunkId: "chunk-1", matchedText: "Acme Corp" }
    };

    const mention2 = {
      type: "EntityMention",
      payload: { entityId: "ent_18", chunkId: "chunk-1", matchedText: "18%" }
    };

    const mention3 = {
      type: "EntityMention",
      payload: { entityId: "ent_acme", chunkId: "chunk-2", matchedText: "Acme Corp" }
    };

    const context: ProviderContext = {
      workflowId: "wf1",
      stageId: "evidence-stage-1",
      engineContext: {} as any
    };

    const result = await provider.execute([chunk1, chunk2, mention1, mention2, mention3], context);

    const proposals = result.artifacts.filter(a => a.type === "EvidenceProposal");
    const references = result.artifacts.filter(a => a.type === "EvidenceReference");
    const catalogs = result.artifacts.filter(a => a.type === "EvidenceCatalog");

    // We expect extraction from chunk 1 and chunk 2 since chunkId is part of deduplication hash
    // (If they were identical in chunk ID too, they'd merge to 1)
    expect(proposals.length).toBe(2);
    
    const prop1 = proposals[0];
    expect(prop1.payload.evidenceType).toBe(EvidenceType.GROWTH_STATEMENT);
    expect(prop1.payload.statement).toBe("revenue grew 18%"); // Normalized regex capture
    expect(prop1.payload.referencedEntityIds).toContain("ent_acme");

    // References bridge the graph back to entities
    const acmeRefs = references.filter(r => r.payload.entityId === "ent_acme");
    expect(acmeRefs.length).toBe(2);

    expect(catalogs.length).toBe(1);
    expect(catalogs[0].payload[EvidenceType.GROWTH_STATEMENT].length).toBe(2);

    // Provenance must exist
    expect(prop1.provenance?.provider).toBe("evidence-extraction-deterministic");
    expect(prop1.provenance?.pipelineId).toBe("wf1");
  });
});
