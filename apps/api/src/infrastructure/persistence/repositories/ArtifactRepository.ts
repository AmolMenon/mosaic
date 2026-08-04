import { BaseRepository } from "./BaseRepository";
import { DbPipelineArtifact } from "../models/DatabaseModels";
import { UnitOfWork } from "../transactions/UnitOfWork";

export class ArtifactRepository extends BaseRepository {
  
  save(artifact: DbPipelineArtifact, uow: UnitOfWork): void {
    uow.register(async () => {
      this.db.memoryStore.pipeline_artifacts.push(artifact);
    });
  }

  saveBatch(artifacts: DbPipelineArtifact[], uow: UnitOfWork): void {
    uow.register(async () => {
      this.db.memoryStore.pipeline_artifacts.push(...artifacts);
    });
  }

  async find(artifactId: string): Promise<DbPipelineArtifact | null> {
    const artifact = this.db.memoryStore.pipeline_artifacts.find(a => a.artifact_id === artifactId);
    return artifact || null;
  }

  async findByExecution(executionId: string): Promise<DbPipelineArtifact[]> {
    return this.db.memoryStore.pipeline_artifacts.filter(a => a.execution_id === executionId);
  }

  async findByType(type: string): Promise<DbPipelineArtifact[]> {
    return this.db.memoryStore.pipeline_artifacts.filter(a => a.artifact_type === type);
  }
}
