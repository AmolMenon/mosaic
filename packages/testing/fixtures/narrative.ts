import { Narrative, NarrativeSection, ArgumentBlock } from "@mosaic/contracts";
import { mockInsightPricing } from "./insights";

export const mockPricingArgumentBlock: ArgumentBlock = {
  id: "blk_pricing_power",
  position: "The 15% price premium is sustainable in the Enterprise segment, generating strong cash flows, though Mid-Market churn poses a risk.",
  supportingInsightIds: [mockInsightPricing.id],
  contradictingInsightIds: [],
  openRiskIds: mockInsightPricing.validation.outstandingRiskIds,
  outstandingAssumptionIds: mockInsightPricing.validation.outstandingAssumptionIds,
  transition: "Given this pricing power, we must next evaluate the competitive landscape.",
  argumentStrength: "medium"
};

export const mockPricingSection: NarrativeSection = {
  id: "sec_pricing",
  title: "Pricing Power & Unit Economics",
  order: 1,
  purpose: "Convince the IC that the company's premium pricing is defensible and will continue to drive gross margin expansion.",
  argumentBlocks: [mockPricingArgumentBlock],
  health: {
    validationStrength: "medium",
    supportingInsightCount: 1,
    openRisksCount: mockInsightPricing.validation.outstandingRiskIds.length,
    missingEvidenceCount: 0,
    completenessScore: 80
  },
  gaps: [
    {
      id: "gap_01",
      description: "Missing insight on competitor pricing reactions in the Mid-Market.",
      severity: "moderate"
    }
  ]
};

export const mockNarrative: Narrative = {
  id: "nar_lbo_thesis_01",
  projectId: "prj_01HVKM4T",
  title: "Project Titan LBO Investment Thesis",
  audience: "investment_committee",
  intent: "recommend_investment",
  flow: {
    sections: [mockPricingSection]
  },
  review: {
    status: "draft"
  },
  currentVersion: {
    id: "v1",
    versionNumber: 1,
    createdAt: "2026-08-03T10:00:00Z",
    authorId: "usr_alice"
  }
};
