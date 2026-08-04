export class DatabaseError extends Error {}
export class ConnectionError extends DatabaseError {}
export class TransactionError extends DatabaseError {}
export class OptimisticLockError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = "OptimisticLockError";
  }
}
export class RecordNotFoundError extends DatabaseError {}
