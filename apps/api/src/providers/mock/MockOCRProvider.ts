import { BaseProvider, ExecutionResult } from "../base/BaseProvider";
import { ProviderConfiguration } from "../base/ProviderConfiguration";
import { ProviderContext } from "../base/ProviderContext";
import { ProviderHealth } from "../base/ProviderHealth";
import { ProviderMetrics } from "../base/ProviderMetrics";
import { PipelineArtifact } from "@mosaic/contracts";

export class MockOCRProvider implements BaseProvider {
  
  async initialize(config: ProviderConfiguration): Promise<void> {
    // Mock warm up
  }

  validateConfiguration(config: ProviderConfiguration): void {
    if (!config.providerId) throw new Error("Missing providerId");
  }

  async execute(inputs: PipelineArtifact[], context: ProviderContext): Promise<ExecutionResult> {
    const pdfArtifact = inputs.find(a => a.type === 'raw_pdf');
    if (!pdfArtifact) throw new Error("Missing raw_pdf artifact");

    return {
      artifacts: [{
        type: 'raw_text',
        payload: { text: "Deterministic Mock Text from PDF" }
      }],
      metrics: {
        executionCount: 1,
        averageLatencyMs: 150,
        totalRuntimeMs: 150,
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
      averageLatencyMs: 150,
      totalRuntimeMs: 150,
      warningsCount: 0,
      failuresCount: 0,
      providerVersion: "1.0.0-mock"
    };
  }

  async shutdown(): Promise<void> {
    // cleanup
  }
}
