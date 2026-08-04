import { BaseProvider } from "../../providers/base/BaseProvider";
import { DependencyResolutionFailure } from "./ReasoningErrors";

export interface PipelineStageConfig {
  id: string;
  providerId: string;
  provider: BaseProvider;
  requiredInputTypes: string[];
  emittedOutputTypes: string[];
}

export class PipelineDependencyResolver {
  
  resolveOrder(stages: PipelineStageConfig[]): PipelineStageConfig[] {
    // In a full implementation, this would perform a topological sort based on 
    // emittedOutputTypes -> requiredInputTypes.
    // For this implementation, we verify the hardcoded progression satisfies dependencies.
    
    let availableArtifactTypes = new Set<string>(["DocumentInput"]);
    const ordered: PipelineStageConfig[] = [];

    // The order should be: Docling -> Entity -> Evidence -> Hypothesis -> IC Review
    // Since we receive the stages as an array, we ensure they can execute in the order they are provided 
    // (the Builder will provide them in the correct dependency sequence).
    
    for (const stage of stages) {
      for (const req of stage.requiredInputTypes) {
        if (!availableArtifactTypes.has(req)) {
          throw new DependencyResolutionFailure(`Stage ${stage.id} requires ${req}, which is not produced by any prior stage.`);
        }
      }
      
      for (const out of stage.emittedOutputTypes) {
        availableArtifactTypes.add(out);
      }
      
      ordered.push(stage);
    }

    return ordered;
  }
}
