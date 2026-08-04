import { Database } from "../../database/Database";
import { TransactionManager } from "../../transactions/TransactionManager";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
import { ExecutionMapper } from "../../mappers/ExecutionMapper";
import { ArtifactMapper } from "../../mappers/ArtifactMapper";
import { PipelineArtifact } from "@mosaic/contracts";
import { RecordNotFoundError, OptimisticLockError } from "../../database/DatabaseErrors";

describe("Transaction Manager", () => {
  let db: Database;
  let txManager: TransactionManager;
  let repos: ReturnType<typeof RepositoryFactory.create>;

  beforeEach(() => {
    db = new Database();
    txManager = new TransactionManager(db);
    repos = RepositoryFactory.create(db);
  });

  it("should rollback all operations if one fails", async () => {
    const execDb = ExecutionMapper.toDb("exec_1", "pipe_1", "doc_1", "running", "Started");
    
    // Seed execution
    await txManager.execute(async (uow) => {
      repos.executions.create(execDb, uow);
    });

    expect(db.memoryStore.executions.length).toBe(1);

    const artifact: PipelineArtifact = { type: "TestArtifact", payload: { id: "a_1" } };
    const artifactDb = ArtifactMapper.toDb(artifact, "exec_1", "doc_1");

    // Attempt invalid transaction
    try {
      await txManager.execute(async (uow) => {
        repos.artifacts.save(artifactDb, uow);
        
        // Throw intentional error to simulate failure
        throw new Error("Simulated failure");
      });
    } catch (e) {
      // Expected
    }

    // Verify rollback
    expect(db.memoryStore.pipeline_artifacts.length).toBe(0);
  });

  it("should support optimistic concurrency on execution updates", async () => {
    const execDb = ExecutionMapper.toDb("exec_2", "pipe_1", "doc_1", "running", "Started");
    
    await txManager.execute(async (uow) => {
      repos.executions.create(execDb, uow);
    });

    // Valid update
    await txManager.execute(async (uow) => {
      repos.executions.update("exec_2", { status: "completed" }, 1, uow);
    });

    expect(db.memoryStore.executions[0].version).toBe(2);

    // Invalid update (wrong version)
    await expect(txManager.execute(async (uow) => {
      repos.executions.update("exec_2", { status: "failed" }, 1, uow);
    })).rejects.toThrow(OptimisticLockError);
  });
});
