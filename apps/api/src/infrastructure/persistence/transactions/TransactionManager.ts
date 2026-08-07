import { Database } from "../database/Database";
import { UnitOfWork } from "./UnitOfWork";

export class TransactionManager {
  constructor(private db: Database) {}

  /**
   * Executes a block of work inside a single transaction.
   * If the block throws an error, it is caught, the transaction is rolled back,
   * and the error is re-thrown.
   */
  async execute<T>(work: (uow: UnitOfWork) => Promise<T>): Promise<T> {
    const uow = new UnitOfWork(this.db);
    
    try {
      await uow.startTransaction();
      // Build the registered operations
      const result = await work(uow);
      
      // Attempt commit
      await uow.commit();
      
      return result;
    } catch (e) {
      await uow.rollback();
      throw e;
    }
  }
}
