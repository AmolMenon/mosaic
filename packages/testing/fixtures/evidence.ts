import { Evidence, Claim, Insight, Question, ClaimEvidenceLink } from "@mosaic/contracts";

export const mockEvidence1: Evidence = {
  id: "ev_1",
  text: "Q3 enterprise revenue grew by 15% year-over-year, driven primarily by expansion in the APAC region.",
  provenance: {
    documentId: "doc_q3_earnings",
    page: 12,
    paragraph: 3,
    boundingBox: { x: 100, y: 200, w: 400, h: 50 },
    extractionMethod: 'pdf_text',
    versionId: "v1",
    importedTimestamp: "2026-08-01T10:00:00Z"
  }
};

export const mockEvidence2: Evidence = {
  id: "ev_2",
  text: "Management expects enterprise churn to increase to 8% due to macro headwinds.",
  provenance: {
    documentId: "doc_mgmt_presentation",
    page: 5,
    paragraph: 1,
    boundingBox: { x: 50, y: 300, w: 500, h: 40 },
    extractionMethod: 'pdf_text',
    versionId: "v1",
    importedTimestamp: "2026-08-02T11:00:00Z"
  }
};

export const mockClaim1: Claim = {
  id: "claim_1",
  insightId: "insight_1",
  statement: "Enterprise revenue is expanding rapidly (15% YoY) despite macro headwinds."
};

export const mockClaim2: Claim = {
  id: "claim_2",
  insightId: "insight_1",
  statement: "Rising churn (8%) poses a risk to NRR sustainability."
};

export const mockLink1: ClaimEvidenceLink = {
  id: "link_1",
  claimId: "claim_1",
  evidenceId: "ev_1",
  role: "SUPPORTS",
  confidence: "high"
};

export const mockLink2: ClaimEvidenceLink = {
  id: "link_2",
  claimId: "claim_2",
  evidenceId: "ev_2",
  role: "RISK",
  confidence: "medium"
};

export const mockInsight1 = {
  id: "insight_1",
  projectId: "prj_01",
  statement: "While top-line enterprise growth remains strong at 15%, increasing churn signals underlying retention risks.",
  status: "draft",
  category: "commercial",
  isPromotedToPrinciple: false
} as unknown as Insight;

export const mockQuestion1: Question = {
  id: "q_1",
  projectId: "prj_01HVKM4T",
  text: "Where does the projected 15% YoY growth originate?",
  status: "answered",
  category: "financial",
  priority: "high",
  createdAt: "2026-08-01T00:00:00Z"
};
