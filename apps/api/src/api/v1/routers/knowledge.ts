import { Router } from "express";
import { requireAuth } from "../dependencies/auth";
import { formatSuccessResponse } from "../dependencies/responses";
import { 
  mockKnowledgeAssetPricing, 
  mockPrinciplePricingPower, 
  mockChallengeHelios,
  mockKnowledgeUsageApollo,
  mockTaxonomyRoot,
  mockTaxonomyPricing,
  mockTaxonomyPremiumization,
  mockTaxonomyElasticity 
} from "@mosaic/testing";

export const knowledgeRouter = Router();

knowledgeRouter.get("/", requireAuth, async (req: any, res: any, next: any) => {
  try {
    res.json(formatSuccessResponse({
      knowledgeAssetPricing: mockKnowledgeAssetPricing,
      principlePricingPower: mockPrinciplePricingPower,
      challengeHelios: mockChallengeHelios,
      knowledgeUsageApollo: mockKnowledgeUsageApollo,
      taxonomyRoot: mockTaxonomyRoot,
      taxonomyPricing: mockTaxonomyPricing,
      taxonomyPremiumization: mockTaxonomyPremiumization,
      taxonomyElasticity: mockTaxonomyElasticity
    }));
  } catch (err) {
    next(err);
  }
});
