import { ArtifactRepository } from "./ArtifactRepository";
import { ExecutionRepository } from "./ExecutionRepository";
import { CheckpointRepository } from "./CheckpointRepository";
import { ProposalRepository } from "./ProposalRepository";
import { MetricsRepository } from "./MetricsRepository";

export interface RepositoryRegistry {
  artifacts: ArtifactRepository;
  executions: ExecutionRepository;
  checkpoints: CheckpointRepository;
  proposals: ProposalRepository;
  metrics: MetricsRepository;
}
