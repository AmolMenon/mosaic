import { Memo, MemoSection, MemoBlock, MemoVersion } from "@mosaic/contracts";
import { mockPrinciplePricingPower } from "./knowledge";

export const mockMemoBlockPrinciple: MemoBlock = {
  id: "mb_01",
  sourceType: "institutional_principle",
  sourceId: mockPrinciplePricingPower.id,
  renderedText: "Apex holds extreme pricing power in the Enterprise segment. Historical precedent demonstrates that Enterprise customers will tolerate up to a 15% price premium when security and compliance SLAs are guaranteed.",
  evidenceStrength: "high",
  readiness: "ready"
};

export const mockMemoBlockArgument: MemoBlock = {
  id: "mb_02",
  sourceType: "argument_block",
  sourceId: "arg_pricing_01", // ID from the narrative fixtures
  renderedText: "However, this pricing leverage does not extend to the Mid-Market. Our diligence indicates that pushing premiums above 8% in this segment will linearly accelerate churn, a critical vulnerability if macroeconomic conditions tighten.",
  evidenceStrength: "medium",
  readiness: "outstanding_risks"
};

export const mockMemoSectionPricing: MemoSection = {
  id: "ms_pricing_01",
  title: "Pricing Power & Elasticity",
  order: 1,
  blocks: [mockMemoBlockPrinciple, mockMemoBlockArgument]
};

export const mockMemoVersion1: MemoVersion = {
  id: "mv_01",
  versionNumber: 1,
  createdAt: "2026-08-01T09:00:00Z",
  authorId: "usr_alice",
};

export const mockMemoVersion2: MemoVersion = {
  id: "mv_02",
  versionNumber: 2,
  createdAt: "2026-08-03T11:00:00Z",
  authorId: "usr_alice",
  knowledgeDiffFromPrevious: {
    addedInsights: ["ins_helios_churn_02"],
    removedNarratives: [],
    changedRisks: ["risk_macro_01"],
    changedAssumptions: [],
    confidenceDelta: -1 // Moved from high to medium due to Mid-Market risk
  }
};

export const mockMemoApolloIC: Memo = {
  id: "memo_apollo_ic",
  projectId: "prj_02XYZ",
  title: "Project Apollo - Investment Committee Memo",
  renderingProfile: "investment_committee",
  sections: [mockMemoSectionPricing],
  currentVersion: mockMemoVersion2,
  readiness: "outstanding_risks"
};
