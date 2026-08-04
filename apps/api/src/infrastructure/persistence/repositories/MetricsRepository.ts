import { BaseRepository } from "./BaseRepository";
import { DbExecutionMetric } from "../models/DatabaseModels";
import { UnitOfWork } from "../transactions/UnitOfWork";

export class MetricsRepository extends BaseRepository {
  
  save(metric: DbExecutionMetric, uow: UnitOfWork): void {
    uow.register(async () => {
      this.db.memoryStore.execution_metrics.push(metric);
    });
  }
}
