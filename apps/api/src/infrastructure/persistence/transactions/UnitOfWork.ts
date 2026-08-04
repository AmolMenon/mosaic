import { Database } from "../database/Database";
import { TransactionError } from "../database/DatabaseErrors";

/**
 * Ensures atomic persistence of stage execution artifacts, checkpoints, and metrics.
 */
export class UnitOfWork {
  private registeredOperations: Array<() => Promise<void>> = [];

  constructor(private db: Database) {}

  register(operation: () => Promise<void>): void {
    this.registeredOperations.push(operation);
  }

  async commit(): Promise<void> {
    try {
      await this.db.query("BEGIN");
      
      for (const op of this.registeredOperations) {
        await op();
      }
      
      await this.db.query("COMMIT");
    } catch (error) {
      await this.db.query("ROLLBACK");
      throw new TransactionError(`Transaction failed and rolled back. Caused by: ${(error as any).message}`);
    } finally {
      this.registeredOperations = [];
    }
  }

  async rollback(): Promise<void> {
    try {
      await this.db.query("ROLLBACK");
    } catch (e) {
      // Ignore
    } finally {
      this.registeredOperations = [];
    }
  }
}
