import { PipelineStageConfig } from "./PipelineDependencyResolver";
import { DoclingProvider } from "../../providers/docling/DoclingProvider";
import { EntityExtractionProvider } from "../../providers/entity-extraction/EntityExtractionProvider";
import { EvidenceExtractionProvider } from "../../providers/evidence-extraction/EvidenceExtractionProvider";
import { HypothesisGenerationProvider } from "../../providers/hypothesis-generation/HypothesisGenerationProvider";
import { ICReviewProvider } from "../../providers/ic-review/ICReviewProvider";

export class ReasoningPipelineBuilder {
  
  buildDefaultPipeline(): PipelineStageConfig[] {
    return [
      {
        id: "stage-docling",
        providerId: "docling_parser",
        provider: new DoclingProvider(),
        requiredInputTypes: ["DocumentInput"],
        emittedOutputTypes: ["TextChunk", "TableChunk", "DocumentMetadata", "ImageChunk"]
      },
      {
        id: "stage-entities",
        providerId: "entity_extraction",
        provider: new EntityExtractionProvider(),
        requiredInputTypes: ["TextChunk"], // Depends on Docling
        emittedOutputTypes: ["EntityMention", "EntityCatalog"]
      },
      {
        id: "stage-evidence",
        providerId: "evidence_extraction",
        provider: new EvidenceExtractionProvider(),
        requiredInputTypes: ["TextChunk", "EntityMention"], // Depends on Docling + Entities
        emittedOutputTypes: ["EvidenceProposal", "EvidenceReference", "EvidenceCatalog"]
      },
      {
        id: "stage-hypotheses",
        providerId: "hypothesis_generation",
        provider: new HypothesisGenerationProvider(),
        requiredInputTypes: ["EvidenceCatalog", "EntityCatalog"], // Depends on Evidence + Entities
        emittedOutputTypes: ["HypothesisProposal", "ReasoningTrace"]
      },
      {
        id: "stage-ic-review",
        providerId: "ic_review",
        provider: new ICReviewProvider(),
        requiredInputTypes: ["HypothesisProposal", "EvidenceCatalog", "EntityCatalog"], // Depends on Hypotheses + Evidence
        emittedOutputTypes: ["ICReviewProposal", "CounterArgument", "DiligenceGap", "ReviewTrace"]
      }
    ];
  }
}
