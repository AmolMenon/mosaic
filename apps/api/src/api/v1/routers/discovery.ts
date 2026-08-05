import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { mockDiscoveryView, mockDiscoveryResultPrinciple, mockPricingEvolution, mockFollowNode } from "@mosaic/testing";

export const discoveryRouter = Router();

discoveryRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    res.json(formatSuccessResponse({
      discoveryView: mockDiscoveryView,
      discoveryResultPrinciple: mockDiscoveryResultPrinciple,
      pricingEvolution: mockPricingEvolution,
      followNode: mockFollowNode
    }));
  } catch (err) {
    next(err);
  }
});
