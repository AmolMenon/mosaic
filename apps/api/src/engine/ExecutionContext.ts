import { ArtifactManager } from "./ArtifactManager";
import { ExecutionLogger } from "./ExecutionLogger";
import { ProviderRegistry } from "./ProviderRegistry";
import { QualityGateEvaluator } from "./QualityGateEvaluator";
import { RetryManager } from "./RetryManager";
import { UnitOfWork } from "../infrastructure/persistence/transactions/UnitOfWork";
import { Database } from "../infrastructure/persistence/database/Database";

export interface ExecutionContext {
  workflowId: string;
  documentId: string;
  artifacts: ArtifactManager;
  logger: ExecutionLogger;
  providers: ProviderRegistry;
  qualityGates: QualityGateEvaluator;
  retries: RetryManager;
  uow: UnitOfWork;
  db: Database;
}

export function createExecutionContext(workflowId: string, documentId: string, providers: ProviderRegistry, db: Database): ExecutionContext {
  const uow = new UnitOfWork(db);
  return {
    workflowId,
    documentId,
    artifacts: new ArtifactManager(),
    logger: new ExecutionLogger(),
    providers,
    qualityGates: new QualityGateEvaluator(),
    retries: new RetryManager(),
    uow,
    db
  };
}
