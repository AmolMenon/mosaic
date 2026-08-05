import { BaseRepository } from "./BaseRepository";
import { DbPipelineArtifact } from "../models/DatabaseModels";
import { UnitOfWork } from "../transactions/UnitOfWork";
import { Prisma } from "@prisma/client";

export class ArtifactRepository extends BaseRepository {
  
  save(artifact: DbPipelineArtifact, uow: UnitOfWork): void {
    uow.register(async (tx: Prisma.TransactionClient) => {
      await tx.pipelineArtifact.create({
        data: {
          artifact_id: artifact.artifact_id,
          execution_id: artifact.execution_id,
          document_id: artifact.document_id,
          artifact_type: artifact.artifact_type,
          payload: artifact.payload as any,
          producer_stage: artifact.producer_stage,
          provider_id: artifact.provider_id,
          provider_version: artifact.provider_version,
          created_at: new Date(artifact.created_at)
        }
      });
    });
  }

  saveBatch(artifacts: DbPipelineArtifact[], uow: UnitOfWork): void {
    uow.register(async (tx: Prisma.TransactionClient) => {
      await tx.pipelineArtifact.createMany({
        data: artifacts.map(artifact => ({
          artifact_id: artifact.artifact_id,
          execution_id: artifact.execution_id,
          document_id: artifact.document_id,
          artifact_type: artifact.artifact_type,
          payload: artifact.payload as any,
          producer_stage: artifact.producer_stage,
          provider_id: artifact.provider_id,
          provider_version: artifact.provider_version,
          created_at: new Date(artifact.created_at)
        }))
      });
    });
  }

  async find(artifactId: string): Promise<DbPipelineArtifact | null> {
    const artifact = await this.db.client.pipelineArtifact.findUnique({
      where: { artifact_id: artifactId }
    });
    if (!artifact) return null;
    return {
      ...artifact,
      created_at: artifact.created_at.toISOString(),
      payload: artifact.payload as any
    };
  }

  async findByExecution(executionId: string): Promise<DbPipelineArtifact[]> {
    const artifacts = await this.db.client.pipelineArtifact.findMany({
      where: { execution_id: executionId }
    });
    return artifacts.map(a => ({
      ...a,
      created_at: a.created_at.toISOString(),
      payload: a.payload as any
    }));
  }

  async findByType(type: string): Promise<DbPipelineArtifact[]> {
    const artifacts = await this.db.client.pipelineArtifact.findMany({
      where: { artifact_type: type }
    });
    return artifacts.map(a => ({
      ...a,
      created_at: a.created_at.toISOString(),
      payload: a.payload as any
    }));
  }
}
