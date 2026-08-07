import { Database } from "../database/Database";
import { TransactionManager } from "../transactions/TransactionManager";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { CheckpointMapper } from "../mappers/CheckpointMapper";
import { ArtifactMapper } from "../mappers/ArtifactMapper";

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      const client = {
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        $extends: jest.fn().mockReturnThis(),
        $transaction: async (cb: any) => { await cb(client); },
        pipelineArtifact: {
          createMany: jest.fn(),
          findMany: jest.fn().mockResolvedValue([
            { artifact_id: "a1", execution_id: "exec_1" },
            { artifact_id: "a2", execution_id: "exec_1" }
          ])
        },
        checkpoint: {
          create: jest.fn(),
          findFirst: jest.fn().mockResolvedValue({ checkpoint_id: "cp2" })
        }
      };
      return client;
    })
  };
});

describe("Repository Queries", () => {
  let db: Database;
  let txManager: TransactionManager;
  let repos: ReturnType<typeof RepositoryFactory.create>;

  beforeEach(() => {
    db = new Database();
    txManager = new TransactionManager(db);
    repos = RepositoryFactory.create(db);
  });

  it("should retrieve artifacts by execution ID", async () => {
    const a1 = ArtifactMapper.toDb({ type: "T1", payload: {} } as any, "exec_1", "doc_1");
    const a2 = ArtifactMapper.toDb({ type: "T2", payload: {} } as any, "exec_1", "doc_1");
    const a3 = ArtifactMapper.toDb({ type: "T3", payload: {} } as any, "exec_2", "doc_2");

    await txManager.execute(async (uow: any) => {
      repos.artifacts.saveBatch([a1, a2, a3], uow);
    });

    const results = await repos.artifacts.findByExecution("exec_1");
    expect(results.length).toBe(2);
  });

  it("should retrieve the latest checkpoint", async () => {
    const cp1 = CheckpointMapper.toDb("cp1", "exec_1", "stage1", [], {}, ["stage1"]);
    // Simulate slight delay
    await new Promise(r => setTimeout(r, 10));
    const cp2 = CheckpointMapper.toDb("cp2", "exec_1", "stage2", [], {}, ["stage1", "stage2"]);

    await txManager.execute(async (uow: any) => {
      repos.checkpoints.save(cp1, uow);
      repos.checkpoints.save(cp2, uow);
    });

    const latest = await repos.checkpoints.latest("exec_1");
    expect(latest?.checkpoint_id).toBe("cp2");
  });
});
