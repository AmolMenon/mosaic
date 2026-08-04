import { Database } from "../database/Database";

export abstract class BaseRepository {
  constructor(protected db: Database) {}
}
