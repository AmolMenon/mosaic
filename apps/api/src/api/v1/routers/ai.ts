import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { mockAssignmentChallengePricing, mockHypothesisProposal } from "@mosaic/testing";

export const aiRouter = Router();

aiRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    res.json(formatSuccessResponse({
      assignmentChallengePricing: mockAssignmentChallengePricing,
      hypothesisProposal: mockHypothesisProposal
    }));
  } catch (err) {
    next(err);
  }
});
