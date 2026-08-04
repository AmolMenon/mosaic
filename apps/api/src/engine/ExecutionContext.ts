import { ArtifactManager } from "./ArtifactManager";
import { ExecutionLogger } from "./ExecutionLogger";
import { ProviderRegistry } from "./ProviderRegistry";
import { QualityGateEvaluator } from "./QualityGateEvaluator";
import { RetryManager } from "./RetryManager";

export interface ExecutionContext {
  workflowId: string;
  artifacts: ArtifactManager;
  logger: ExecutionLogger;
  providers: ProviderRegistry;
  qualityGates: QualityGateEvaluator;
  retries: RetryManager;
}

export function createExecutionContext(workflowId: string, providers: ProviderRegistry): ExecutionContext {
  return {
    workflowId,
    artifacts: new ArtifactManager(),
    logger: new ExecutionLogger(),
    providers,
    qualityGates: new QualityGateEvaluator(),
    retries: new RetryManager()
  };
}
