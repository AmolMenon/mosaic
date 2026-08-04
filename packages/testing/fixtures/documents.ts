import { Document, ReadingContext } from "@mosaic/contracts";

export const mockDocumentCIM: Document = {
  id: "doc_cim_v2",
  projectId: "prj_01HVKM4T",
  title: "Project Titan CIM v2.pdf",
  fileName: "Project_Titan_CIM_v2_Final.pdf",
  source: "vdr",
  status: "ready",
  version: 2,
  metadata: {
    author: "Goldman Sachs",
    publishDate: "2026-07-15T00:00:00Z",
    pageCount: 142,
    fileSize: 4500000,
    custom: {}
  },
  tags: ["CIM", "Financials", "Confidential"],
  createdAt: "2026-07-15T09:00:00Z",
  updatedAt: "2026-07-16T10:00:00Z"
};

export const mockDocumentTranscripts: Document = {
  id: "doc_q3_earnings",
  projectId: "prj_01HVKM4T",
  title: "Q3 Earnings Transcript.pdf",
  fileName: "Apex_Q3_Earnings_Transcript.pdf",
  source: "web",
  status: "ready",
  version: 1,
  metadata: {
    author: "Apex Software",
    pageCount: 15,
    fileSize: 200000,
    custom: {}
  },
  tags: ["Earnings", "Transcripts"],
  createdAt: "2026-08-01T10:00:00Z",
  updatedAt: "2026-08-01T10:00:00Z"
};

// Represents a reading path: e.g. navigating all paragraphs that answer a specific question.
export const mockReadingPath = [
  { documentId: "doc_cim_v2", page: 42, paragraph: 2 },
  { documentId: "doc_cim_v2", page: 42, paragraph: 5 },
  { documentId: "doc_q3_earnings", page: 3, paragraph: 12 },
];
