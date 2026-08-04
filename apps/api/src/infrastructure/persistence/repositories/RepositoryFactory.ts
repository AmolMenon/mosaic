import { Database } from "../database/Database";
import { RepositoryRegistry } from "./RepositoryRegistry";
import { ArtifactRepository } from "./ArtifactRepository";
import { ExecutionRepository } from "./ExecutionRepository";
import { CheckpointRepository } from "./CheckpointRepository";
import { ProposalRepository } from "./ProposalRepository";
import { MetricsRepository } from "./MetricsRepository";

export class RepositoryFactory {
  static create(db: Database): RepositoryRegistry {
    return {
      artifacts: new ArtifactRepository(db),
      executions: new ExecutionRepository(db),
      checkpoints: new CheckpointRepository(db),
      proposals: new ProposalRepository(db),
      metrics: new MetricsRepository(db)
    };
  }
}
