import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { mockInsightPricing } from "@mosaic/testing";

export const insightsRouter = Router();

insightsRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    res.json(formatSuccessResponse({
      insightPricing: mockInsightPricing
    }));
  } catch (err) {
    next(err);
  }
});
