export class ReasoningOrchestratorError extends Error {}
export class PipelineValidationFailure extends ReasoningOrchestratorError {}
export class ProviderExecutionFailure extends ReasoningOrchestratorError {
  constructor(message: string, public providerId: string, public stage: string, public originalError?: any) {
    super(message);
  }
}
export class QualityGateFailure extends ReasoningOrchestratorError {}
export class DependencyResolutionFailure extends ReasoningOrchestratorError {}
export class CheckpointCorruptionFailure extends ReasoningOrchestratorError {}
export class RecoveryFailure extends ReasoningOrchestratorError {}
