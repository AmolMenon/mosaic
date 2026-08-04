// Transaction Boundaries Refactored

export interface UnitOfWork {
  /**
   * Starts a new short-lived transaction.
   * Throws an error if another transaction is already open in this context.
   */
  startTransaction(): Promise<void>;

  /**
   * Commits the current transaction.
   * Fails quickly if optimistic concurrency checks fail.
   */
  commit(): Promise<void>;

  /**
   * Rolls back the transaction.
   */
  rollback(): Promise<void>;

  /**
   * IMPORTANT HARDENING CONSTRAINT:
   * No transaction may span a provider execution.
   * Call `commit()` BEFORE calling any external I/O or LLM.
   * Call `startTransaction()` AFTER the provider returns to persist the result.
   */
}
