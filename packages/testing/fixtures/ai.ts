import { AIAssignment, AIDeliverable, Proposal } from "@mosaic/contracts";
import { mockPrinciplePricingPower } from "./knowledge";
import { mockInsightPricing } from "./insights";

// Mocking a Hypothesis object since the AI is proposing one
export const mockProposedHypothesis = {
  id: "hyp_prop_01",
  questionId: "q_pricing_01",
  statement: "Mid-Market churn will accelerate beyond 8% premium due to tightening macro conditions.",
  status: "untested"
};

export const mockHypothesisProposal: Proposal<typeof mockProposedHypothesis> = {
  id: "prop_hyp_01",
  proposalType: "hypothesis_proposal",
  targetObject: mockProposedHypothesis,
  reasoning: {
    whySuggested: "Earnings call transcript identified price sensitivity explicitly mentioned by CFO for mid-market cohort.",
    supportingEvidenceIds: ["ev_transcript_q3_01"],
    referencedInsightIds: [mockInsightPricing.id],
    institutionalPrinciples: [mockPrinciplePricingPower.id],
    assumptionsMade: ["Macro conditions remain constrained through next 12 months"],
    uncertaintyRemaining: "Exact churn acceleration curve is not quantified in the transcript."
  },
  confidence: 85,
  status: "pending_review",
  createdAt: "2026-08-04T09:00:00Z"
};

export const mockDeliverableRiskAssessment: AIDeliverable = {
  id: "del_risk_01",
  title: "Pricing Risk Assessment",
  type: "Risk Assessment",
  proposals: [mockHypothesisProposal],
  status: "ready_for_review"
};

export const mockAssignmentChallengePricing: AIAssignment = {
  id: "assign_chal_01",
  projectId: "prj_02XYZ",
  specialistRole: "commercial_dd",
  objective: "Challenge the Narrative around Pricing Power sustainability",
  scope: "Analyze Q3 Earnings against our 15% enterprise premium assumption",
  status: "needs_review",
  progress: 100,
  plan: {
    estimatedSteps: [
      "Extract mid-market mentions from Q3 Earnings",
      "Compare management tone vs previous quarter",
      "Identify contradictions with our 'Enterprise Price Elasticity' principle",
      "Draft alternative downside hypotheses"
    ],
    expectedOutputs: [
      "Risk Assessment Deliverable",
      "New Downside Hypotheses"
    ],
    estimatedCompletionMinutes: 15,
    status: "approved"
  },
  deliverables: [mockDeliverableRiskAssessment],
  createdAt: "2026-08-04T08:30:00Z"
};
