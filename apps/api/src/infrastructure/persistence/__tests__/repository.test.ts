import { Database } from "../../database/Database";
import { TransactionManager } from "../../transactions/TransactionManager";
import { RepositoryFactory } from "../../repositories/RepositoryFactory";
import { CheckpointMapper } from "../../mappers/CheckpointMapper";
import { ArtifactMapper } from "../../mappers/ArtifactMapper";

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
    const a1 = ArtifactMapper.toDb({ type: "T1", payload: {} }, "exec_1", "doc_1");
    const a2 = ArtifactMapper.toDb({ type: "T2", payload: {} }, "exec_1", "doc_1");
    const a3 = ArtifactMapper.toDb({ type: "T3", payload: {} }, "exec_2", "doc_2");

    await txManager.execute(async (uow) => {
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

    await txManager.execute(async (uow) => {
      repos.checkpoints.save(cp1, uow);
      repos.checkpoints.save(cp2, uow);
    });

    const latest = await repos.checkpoints.latest("exec_1");
    expect(latest?.checkpoint_id).toBe("cp2");
  });
});
