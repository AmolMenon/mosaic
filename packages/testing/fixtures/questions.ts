import { Question, Hypothesis, QuestionDependency } from "@mosaic/contracts";

export const mockQuestionPricing: Question = {
  id: "q_pricing_01",
  projectId: "prj_01HVKM4T",
  text: "Is the 15% price premium sustainable in the current macro environment?",
  category: "commercial",
  priority: "high",
  status: "investigating",
  analystPosition: "The 15% premium appears sustainable only in the enterprise segment, but is highly vulnerable to churn in the SMB segment unless new feature velocity is maintained.",
  createdAt: "2026-08-01T10:00:00Z"
};

export const mockQuestionLoyalty: Question = {
  id: "q_loyalty_01",
  projectId: "prj_01HVKM4T",
  text: "What is the true enterprise net retention rate (NRR)?",
  category: "financial",
  priority: "critical",
  status: "answered",
  createdAt: "2026-07-30T10:00:00Z"
};

export const mockQuestionDependencies: QuestionDependency[] = [
  {
    id: "dep_01",
    parentQuestionId: "q_pricing_01",
    childQuestionId: "q_loyalty_01"
  }
];

export const mockHypothesisPremium: Hypothesis = {
  id: "hyp_premium_01",
  questionId: "q_pricing_01",
  statement: "The premium is sustainable because enterprise customers prioritize security compliance over price.",
  status: "supported",
  supportingEvidenceIds: ["ev_1", "ev_sec_report"],
  contradictingEvidenceIds: ["ev_2"],
  evidenceGaps: ["Need Q4 win/loss data against lower-priced competitor (Apex)."],
  
  assumptions: [
    {
      id: "asm_1",
      statement: "Enterprise IT budgets will not be cut by more than 5% this year.",
      linkedEvidenceIds: ["ev_gartner_report"]
    }
  ],
  
  risks: [
    {
      id: "rsk_1",
      statement: "A new SOC2-compliant competitor could commoditize the security advantage."
    }
  ],
  
  counterarguments: [
    {
      id: "ca_1",
      statement: "CFOs are increasingly overriding CISOs on software renewals to cut costs.",
      supportingEvidenceIds: ["ev_cfo_survey"],
      contradictingEvidenceIds: ["ev_retention_data"],
      strength: "moderate",
      status: "open"
    }
  ],
  
  confidence: "medium",
  confidenceExplanation: "Confidence is Medium because while historical enterprise retention (ev_1) is strong, the emerging CFO-driven cost-cutting trend (ca_1) and missing Q4 win/loss data creates a significant risk gap.",
  
  createdAt: "2026-08-02T10:00:00Z",
  updatedAt: "2026-08-03T10:00:00Z"
};

export const mockHypothesisVulnerable: Hypothesis = {
  id: "hyp_premium_02",
  questionId: "q_pricing_01",
  statement: "The premium will compress as macro headwinds force mid-market customers to downgrade.",
  status: "needs_validation",
  supportingEvidenceIds: ["ev_2"],
  contradictingEvidenceIds: [],
  evidenceGaps: ["Need churn cohort analysis by customer size."],
  assumptions: [],
  risks: [],
  counterarguments: [],
  confidence: "low",
  confidenceExplanation: "Confidence is Low because we only have anecdotal evidence from management (ev_2) and lack hard churn cohort data.",
  createdAt: "2026-08-02T11:00:00Z",
  updatedAt: "2026-08-03T10:00:00Z"
};
