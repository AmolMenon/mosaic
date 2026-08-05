import { BaseRepository } from "./BaseRepository";
import { DbProposal } from "../models/DatabaseModels";
import { UnitOfWork } from "../transactions/UnitOfWork";
import { Prisma } from "@prisma/client";

export class ProposalRepository extends BaseRepository {
  
  save(proposal: DbProposal, uow: UnitOfWork): void {
    uow.register(async (tx: Prisma.TransactionClient) => {
      await tx.proposal.create({
        data: {
          proposal_id: proposal.proposal_id,
          execution_id: proposal.execution_id,
          proposal_type: proposal.proposal_type,
          payload: proposal.payload as any,
          created_at: new Date(proposal.created_at)
        }
      });
    });
  }
}
