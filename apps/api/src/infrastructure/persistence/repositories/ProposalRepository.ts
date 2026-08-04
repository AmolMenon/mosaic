import { BaseRepository } from "./BaseRepository";
import { DbProposal } from "../models/DatabaseModels";
import { UnitOfWork } from "../transactions/UnitOfWork";

export class ProposalRepository extends BaseRepository {
  
  save(proposal: DbProposal, uow: UnitOfWork): void {
    uow.register(async () => {
      this.db.memoryStore.proposals.push(proposal);
    });
  }
}
