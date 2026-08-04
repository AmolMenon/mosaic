import { KnowledgeAsset, TaxonomyNode, KnowledgeUsage, Challenge, InstitutionalPrinciple } from "@mosaic/contracts";
import { mockInsightPricing } from "./insights";

export const mockTaxonomyRoot: TaxonomyNode = {
  id: "tax_consumer",
  name: "Consumer",
  parentId: null,
  childrenIds: ["tax_pricing"]
};

export const mockTaxonomyPricing: TaxonomyNode = {
  id: "tax_pricing",
  name: "Pricing",
  parentId: "tax_consumer",
  childrenIds: ["tax_premiumization"]
};

export const mockTaxonomyPremiumization: TaxonomyNode = {
  id: "tax_premiumization",
  name: "Premiumization",
  parentId: "tax_pricing",
  childrenIds: ["tax_elasticity"]
};

export const mockTaxonomyElasticity: TaxonomyNode = {
  id: "tax_elasticity",
  name: "Elasticity",
  parentId: "tax_premiumization",
  childrenIds: []
};

export const mockPrinciplePricingPower: InstitutionalPrinciple = {
  id: "prin_b2b_pricing_01",
  sourceInsightId: mockInsightPricing.id,
  originProjectId: "prj_01HVKM4T", // Titan
  statement: "Enterprise customers tolerate up to a 15% price premium if security and compliance SLAs are guaranteed; Mid-Market churn accelerates linearly above 8%.",
  status: "active",
  reviewSchedule: "annual"
};

export const mockKnowledgeAssetPricing: KnowledgeAsset = {
  id: "kna_pricing_power_01",
  type: "principle",
  sourceId: mockPrinciplePricingPower.id,
  taxonomyNodeId: mockTaxonomyElasticity.id,
  title: "Enterprise Price Premium Tolerance",
  summary: "Identifies the ceiling for price premiums in B2B enterprise software before triggering churn.",
  isPinned: true,
  confidence: {
    numberOfUses: 3,
    successfulValidations: 2,
    contradictions: 1,
    lastReviewed: "2026-07-15T09:00:00Z"
  },
  freshness: "current",
  reuseGraph: {
    originProjectId: "prj_01HVKM4T", // Titan
    derivedPrincipleId: mockPrinciplePricingPower.id,
    projectsReusedIn: ["prj_02XYZ", "prj_03ABC"] // Apollo, Helios
  }
};

export const mockKnowledgeUsageApollo: KnowledgeUsage = {
  id: "use_apollo_01",
  knowledgeAssetId: mockKnowledgeAssetPricing.id,
  reusingProjectId: "prj_02XYZ", // Apollo
  userId: "usr_alice",
  timestamp: "2026-08-01T14:30:00Z",
  context: "Used as a baseline assumption for Project Apollo's downside revenue model."
};

export const mockChallengeHelios: Challenge = {
  id: "chal_helios_01",
  knowledgeAssetId: mockKnowledgeAssetPricing.id,
  projectId: "prj_03ABC", // Helios
  contradictingInsightId: "ins_helios_churn_02",
  resolution: "refined",
  resolutionNotes: "Helios data showed Mid-Market churn actually accelerates at 6% during high interest rate environments. Principle updated to reflect macro conditions."
};
