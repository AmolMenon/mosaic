import { DiscoveryResult, KnowledgeView, FollowNode, KnowledgeEvolution } from "@mosaic/contracts";
import { mockPrinciplePricingPower, mockKnowledgeAssetPricing, mockTaxonomyPremiumization } from "./knowledge";

export const mockDiscoveryView: KnowledgeView = {
  id: "view_pricing_power",
  name: "B2B Pricing Trends",
  description: "Tracking the evolution of software pricing power across enterprise portfolios.",
  query: "pricing power premiumization",
  filters: {
    taxonomyIds: [mockTaxonomyPremiumization.id],
    freshness: ["current", "fresh"]
  },
  isPinned: true
};

export const mockDiscoveryResultPrinciple: DiscoveryResult = {
  id: "res_prin_01",
  assetId: mockPrinciplePricingPower.id,
  type: "principle",
  title: "Enterprise Price Premium Tolerance",
  snippet: "Enterprise customers tolerate up to a 15% price premium if security and compliance SLAs are guaranteed; Mid-Market churn accelerates linearly above 8%.",
  explanation: {
    matchedTerm: "pricing power",
    matchReason: "Firm-wide principle explicitly modeling pricing power ceilings.",
    traversedRelationships: ["Project Titan -> Insight -> Principle"],
    supportedPrinciples: [mockPrinciplePricingPower.id],
    reusingProjects: ["prj_02XYZ", "prj_03ABC"] // Apollo, Helios
  }
};

export const mockPricingEvolution: KnowledgeEvolution = {
  assetId: mockPrinciplePricingPower.id,
  conceptName: "Enterprise Price Elasticity",
  projectTimeline: [
    {
      projectId: "prj_01HVKM4T",
      projectName: "Nykaa",
      context: "Discovered extreme elasticity in beauty sector up to 10% premium.",
      timestamp: "2024-03-01T10:00:00Z"
    },
    {
      projectId: "prj_mamaearth",
      projectName: "Mamaearth",
      context: "Validated the 10% threshold; identified margin compression beyond 12%.",
      timestamp: "2025-01-15T10:00:00Z"
    },
    {
      projectId: "prj_boat",
      projectName: "Boat",
      context: "Refined principle to account for high interest rate environments dropping tolerance to 8%.",
      timestamp: "2025-11-20T10:00:00Z"
    },
    {
      projectId: "prj_current",
      projectName: "Project Apollo",
      context: "Current active diligence testing the 8% baseline assumption.",
      timestamp: "2026-08-01T10:00:00Z"
    }
  ]
};

export const mockFollowNode: FollowNode = {
  id: "fol_01",
  targetId: mockPrinciplePricingPower.id,
  targetType: "principle",
  userId: "usr_alice",
  subscribedAt: "2026-08-02T10:00:00Z"
};
