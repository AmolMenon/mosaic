import { Database } from "../database/Database";
import { TransactionError } from "../database/DatabaseErrors";

/**
 * Ensures atomic persistence of stage execution artifacts, checkpoints, and metrics.
 */
export class UnitOfWork {
  private registeredOperations: Array<(tx: any) => Promise<void>> = [];

  constructor(private db: Database) {}

  register(operation: (tx: any) => Promise<void>): void {
    this.registeredOperations.push(operation);
  }

  async commit(): Promise<void> {
    try {
      if (this.registeredOperations.length === 0) return;
      
      await this.db.client.$transaction(async (tx: any) => {
        for (const op of this.registeredOperations) {
          await op(tx);
        }
      });
    } catch (error) {
      throw new TransactionError(`Transaction failed and rolled back. Caused by: ${(error as any).message}`);
    } finally {
      this.registeredOperations = [];
    }
  }

  async rollback(): Promise<void> {
    this.registeredOperations = [];
  }
}
