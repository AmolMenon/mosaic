import { PipelineStageConfig } from "./PipelineDependencyResolver";
import { PipelineValidationFailure } from "./ReasoningErrors";
import { PipelineArtifact } from "@mosaic/contracts";

export class PipelineValidator {
  
  validatePipeline(stages: PipelineStageConfig[]): void {
    if (!stages || stages.length === 0) {
      throw new PipelineValidationFailure("Pipeline contains no stages.");
    }
    
    const providerIds = stages.map(s => s.providerId);
    
    if (!providerIds.includes("docling_parser")) throw new PipelineValidationFailure("Missing Docling provider");
    if (!providerIds.includes("entity_extraction")) throw new PipelineValidationFailure("Missing Entity provider");
    if (!providerIds.includes("evidence_extraction")) throw new PipelineValidationFailure("Missing Evidence provider");
    if (!providerIds.includes("hypothesis_generation")) throw new PipelineValidationFailure("Missing Hypothesis provider");
    if (!providerIds.includes("ic_review")) throw new PipelineValidationFailure("Missing IC Review provider");
  }

  validateInputs(inputs: PipelineArtifact[]): void {
    if (!inputs || inputs.length === 0) {
      throw new PipelineValidationFailure("No input artifacts provided to pipeline.");
    }
  }
}
