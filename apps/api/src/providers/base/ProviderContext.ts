import { ExecutionContext } from "../../../engine/ExecutionContext";

export interface ProviderContext {
  workflowId: string;
  stageId: string;
  engineContext: ExecutionContext; // For read-only reference if necessary, though providers should ideally be pure
}
