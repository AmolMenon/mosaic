import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { mockQuestionPricing, mockHypothesisPremium, mockHypothesisVulnerable, mockEvidence1, mockEvidence2 } from "@mosaic/testing";

export const questionsRouter = Router();

questionsRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    res.json(formatSuccessResponse({
      questionPricing: mockQuestionPricing,
      hypothesisPremium: mockHypothesisPremium,
      hypothesisVulnerable: mockHypothesisVulnerable,
      evidence1: mockEvidence1,
      evidence2: mockEvidence2
    }));
  } catch (err) {
    next(err);
  }
});
