import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { mockNarrative, mockPricingSection, mockInsightPricing } from "@mosaic/testing";

export const narrativesRouter = Router();

narrativesRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    res.json(formatSuccessResponse({
      narrative: mockNarrative,
      pricingSection: mockPricingSection,
      insightPricing: mockInsightPricing
    }));
  } catch (err) {
    next(err);
  }
});
