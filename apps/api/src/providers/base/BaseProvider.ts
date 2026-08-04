import { PipelineArtifact } from "@mosaic/contracts";
import { ProviderConfiguration } from "./ProviderConfiguration";
import { ProviderContext } from "./ProviderContext";
import { ProviderHealth } from "./ProviderHealth";
import { ProviderMetrics } from "./ProviderMetrics";

export interface ExecutionResult {
  artifacts: Partial<PipelineArtifact>[]; // The provider returns partials, the engine stamps provenance
  metrics: Partial<ProviderMetrics>;
  warnings: string[];
}

export interface BaseProvider {
  initialize(config: ProviderConfiguration): Promise<void>;
  validateConfiguration(config: ProviderConfiguration): void;
  execute(inputs: PipelineArtifact[], context: ProviderContext): Promise<ExecutionResult>;
  health(): Promise<ProviderHealth>;
  metrics(): ProviderMetrics;
  shutdown(): Promise<void>;
}
