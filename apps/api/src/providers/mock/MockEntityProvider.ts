import { BaseProvider, ExecutionResult } from "../base/BaseProvider";
import { ProviderConfiguration } from "../base/ProviderConfiguration";
import { ProviderContext } from "../base/ProviderContext";
import { ProviderHealth } from "../base/ProviderHealth";
import { ProviderMetrics } from "../base/ProviderMetrics";
import { PipelineArtifact } from "@mosaic/contracts";

export class MockEntityProvider implements BaseProvider {
  
  async initialize(config: ProviderConfiguration): Promise<void> {}

  validateConfiguration(config: ProviderConfiguration): void {}

  async execute(inputs: PipelineArtifact[], context: ProviderContext): Promise<ExecutionResult> {
    const chunkArtifact = inputs.find(a => a.type === 'chunks' || a.type === 'raw_text');
    if (!chunkArtifact) throw new Error("Missing text artifact");

    return {
      artifacts: [{
        type: 'extracted_entities',
        payload: { 
          entities: [
            { name: "Acme Corp", type: "Company" },
            { name: "15%", type: "Metric" }
          ]
        }
      }],
      metrics: {
        executionCount: 1,
        averageLatencyMs: 450,
        totalRuntimeMs: 450,
        warningsCount: 0,
        failuresCount: 0,
        providerVersion: "1.0.0-mock"
      },
      warnings: []
    };
  }

  async health(): Promise<ProviderHealth> {
    return { status: 'Healthy', lastChecked: new Date().toISOString() };
  }

  metrics(): ProviderMetrics {
    return {
      executionCount: 1,
      averageLatencyMs: 450,
      totalRuntimeMs: 450,
      warningsCount: 0,
      failuresCount: 0,
      providerVersion: "1.0.0-mock"
    };
  }

  async shutdown(): Promise<void> {}
}
