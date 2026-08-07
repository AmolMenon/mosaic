import { Database } from "../database/Database";
import { TransactionManager } from "../transactions/TransactionManager";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { ExecutionMapper } from "../mappers/ExecutionMapper";
import { ArtifactMapper } from "../mappers/ArtifactMapper";
import { PipelineArtifact } from "@mosaic/contracts";
import { OptimisticLockError } from "../database/DatabaseErrors";

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      const client = {
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        $extends: jest.fn().mockReturnThis(),
        $transaction: async (cb: any) => { await cb(client); },
        execution: {
          findUnique: async (data: any) => {
            return (global as any).__memoryStore.executions.find((e: any) => e.execution_id === data.where.execution_id);
          },
          create: async (data: any) => {
            (global as any).__memoryStore.executions.push(data.data);
          },
          update: async (data: any) => {
            const exec = (global as any).__memoryStore.executions.find((e: any) => e.execution_id === data.where.execution_id);
            if (exec) exec.version++;
            else throw new Error("OptimisticLockError"); // For the sake of the test mock
          }
        },
        pipelineArtifact: {
          create: async (data: any) => {
            (global as any).__memoryStore.pipeline_artifacts.push(data.data);
          }
        }
      };
      return client;
    })
  };
});

describe("Transaction Manager", () => {
  let db: Database;
  let txManager: TransactionManager;
  let repos: ReturnType<typeof RepositoryFactory.create>;

  beforeEach(() => {
    (global as any).__memoryStore = {
      executions: [],
      pipeline_artifacts: []
    };
    db = new Database();
    (db as any).memoryStore = (global as any).__memoryStore;
    txManager = new TransactionManager(db);
    repos = RepositoryFactory.create(db);
  });

  it("should rollback all operations if one fails", async () => {
    const execDb = ExecutionMapper.toDb("exec_1", "pipe_1", "doc_1", "running", "Started");
    
    // Seed execution
    await txManager.execute(async (uow: any) => {
      repos.executions.create(execDb, uow);
    });

    expect((db as any).memoryStore.executions.length).toBe(1);

    const artifact = { type: "TestArtifact", payload: { id: "a_1" } } as unknown as PipelineArtifact;
    const artifactDb = ArtifactMapper.toDb(artifact, "exec_1", "doc_1");

    // Attempt invalid transaction
    try {
      await txManager.execute(async (uow: any) => {
        repos.artifacts.save(artifactDb, uow);
        
        // Throw intentional error to simulate failure
        throw new Error("Simulated failure");
      });
    } catch (e) {
      // Expected
    }

    // Verify rollback
    expect((db as any).memoryStore.pipeline_artifacts.length).toBe(0);
  });

  it("should support optimistic concurrency on execution updates", async () => {
    const execDb = ExecutionMapper.toDb("exec_2", "pipe_1", "doc_1", "running", "Started");
    
    await txManager.execute(async (uow: any) => {
      repos.executions.create(execDb, uow);
    });

    // Valid update
    await txManager.execute(async (uow: any) => {
      repos.executions.update("exec_2", { status: "completed" }, 1, uow);
    });

    expect((db as any).memoryStore.executions[0].version).toBe(2);

    // Invalid update (wrong version)
    await expect(txManager.execute(async (uow: any) => {
      repos.executions.update("exec_2", { status: "failed" }, 1, uow);
    })).rejects.toThrow(/Version mismatch/);
  });
});
