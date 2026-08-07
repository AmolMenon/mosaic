import { Database } from "../database/Database";
import { TransactionError } from "../database/DatabaseErrors";
import { UnitOfWork as IUnitOfWork } from "../UnitOfWork";

export class UnitOfWork implements IUnitOfWork {
  private registeredOperations: Array<(tx: any) => Promise<void>> = [];
  private transactionActive: boolean = false;

  constructor(private db: Database) {}

  async startTransaction(): Promise<void> {
    if (this.transactionActive) {
      throw new Error("Transaction already active");
    }
    this.transactionActive = true;
    this.registeredOperations = [];
  }

  register(operation: (tx: any) => Promise<void>): void {
    if (!this.transactionActive) {
       throw new Error("Must start a transaction before registering operations.");
    }
    this.registeredOperations.push(operation);
  }

  async commit(): Promise<void> {
    try {
      if (!this.transactionActive) return;
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
      this.transactionActive = false;
    }
  }

  async rollback(): Promise<void> {
    this.registeredOperations = [];
    this.transactionActive = false;
  }
}
