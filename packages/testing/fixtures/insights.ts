import { Insight, InsightCollection, InsightRelationship } from "@mosaic/contracts";
import { mockHypothesisPremium, mockHypothesisVulnerable, mockQuestionPricing } from "./questions";

export const mockInsightPricing: Insight = {
  id: "ins_pricing_power_01",
  projectId: "prj_01HVKM4T",
  statement: "The 15% price premium is sustainable within the Enterprise segment due to SOC2 compliance, but creates high vulnerability to Apex in the Mid-Market.",
  analystCommentary: "We initially believed the premium was safe across the board, but evidence of CFO-driven downgrades forces us to model a higher churn assumption for SMBs.",
  status: "validated",
  category: "commercial",
  isPromotedToPrinciple: false,
  
  sourceQuestionIds: [mockQuestionPricing.id],
  
  validation: {
    supportingHypothesisIds: [mockHypothesisPremium.id],
    conflictingHypothesisIds: [mockHypothesisVulnerable.id],
    supportingEvidenceIds: ["ev_1"],
    contradictingEvidenceIds: ["ev_2"],
    outstandingAssumptionIds: mockHypothesisPremium.assumptions.map((a: any) => a.id),
    outstandingRiskIds: mockHypothesisPremium.risks.map((r: any) => r.id),
    confidence: "medium",
    confidenceExplanation: "Medium confidence due to strong enterprise retention history counterbalanced by missing Q4 win/loss mid-market data."
  },
  
  ownership: {
    authorId: "usr_alice",
    reviewerId: "usr_bob_lead",
    lastReviewed: "2026-08-03T09:00:00Z",
    reviewNotes: "Approved. Make sure this informs the downside case in the LBO model."
  },
  
  currentVersion: {
    id: "v2",
    versionNumber: 2,
    createdAt: "2026-08-02T16:00:00Z",
    authorId: "usr_alice"
  }
};

export const mockInsightCollection: InsightCollection = {
  id: "col_pricing",
  projectId: "prj_01HVKM4T",
  name: "Pricing & Margins",
  description: "Aggregated insights regarding unit economics and pricing power sustainability.",
  insightIds: [mockInsightPricing.id]
};
