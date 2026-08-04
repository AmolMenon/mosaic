import { IngestionPipeline, IngestionStage, PipelineArtifact } from "@mosaic/contracts";

export const mockArtifactOCR: PipelineArtifact = {
  id: "art_ocr_01",
  type: "raw_text",
  payload: { text: "Q3 mid-market churn accelerated to 8.2%..." },
  provenance: {
    producerStage: "stg_ocr_01",
    provider: "Mock_OCR_Provider",
    pipelineId: "pipe_transcript_01",
    version: 1,
    timestamp: "2026-08-04T10:00:00Z"
  }
};

export const mockArtifactEntities: PipelineArtifact = {
  id: "art_ent_01",
  type: "extracted_entities",
  payload: { entities: [{ name: "Mid-Market", type: "Segment" }, { name: "8.2%", type: "Metric" }] },
  provenance: {
    producerStage: "stg_extraction_01",
    provider: "Mock_LLM_Extraction",
    pipelineId: "pipe_transcript_01",
    version: 1,
    timestamp: "2026-08-04T10:01:00Z"
  }
};

export const mockStageOCR: IngestionStage = {
  id: "stg_ocr_01",
  name: "Document OCR",
  contract: {
    inputArtifactTypes: ["raw_pdf"],
    outputArtifactTypes: ["raw_text"]
  },
  status: "success",
  startTime: "2026-08-04T09:59:00Z",
  endTime: "2026-08-04T10:00:00Z",
  retryCount: 0,
  logs: [{ timestamp: "2026-08-04T10:00:00Z", level: "info", message: "OCR completed successfully. 42 pages processed." }],
  qualityGates: [{ metric: "confidence_score", threshold: 0.90, actualValue: 0.98, passed: true, actionOnFailure: "pause_for_human" }],
  inputArtifactIds: [],
  outputArtifactIds: [mockArtifactOCR.id]
};

export const mockStageExtraction: IngestionStage = {
  id: "stg_extraction_01",
  name: "Entity Extraction",
  contract: {
    inputArtifactTypes: ["raw_text"],
    outputArtifactTypes: ["extracted_entities"]
  },
  status: "success",
  startTime: "2026-08-04T10:00:05Z",
  endTime: "2026-08-04T10:01:00Z",
  retryCount: 0,
  logs: [{ timestamp: "2026-08-04T10:01:00Z", level: "info", message: "Extracted 145 financial entities." }],
  qualityGates: [{ metric: "schema_validation", threshold: 1.0, actualValue: 1.0, passed: true, actionOnFailure: "fail_pipeline" }],
  inputArtifactIds: [mockArtifactOCR.id],
  outputArtifactIds: [mockArtifactEntities.id]
};

export const mockStageHumanReview: IngestionStage = {
  id: "stg_human_01",
  name: "Human Quality Review",
  contract: {
    inputArtifactTypes: ["extracted_entities"],
    outputArtifactTypes: ["validated_entities"]
  },
  status: "awaiting_human",
  startTime: "2026-08-04T10:01:05Z",
  retryCount: 0,
  logs: [{ timestamp: "2026-08-04T10:01:05Z", level: "warn", message: "Quality Gate triggered. Awaiting human validation of extracted entities before generating proposals." }],
  qualityGates: [{ metric: "entity_confidence", threshold: 0.95, actualValue: 0.82, passed: false, actionOnFailure: "pause_for_human" }],
  inputArtifactIds: [mockArtifactEntities.id],
  outputArtifactIds: []
};

export const mockPipelineTranscript: IngestionPipeline = {
  id: "pipe_transcript_01",
  documentId: "doc_transcript_q3",
  profile: "deep_diligence",
  status: "paused",
  stages: [mockStageOCR, mockStageExtraction, mockStageHumanReview],
  artifacts: [mockArtifactOCR, mockArtifactEntities],
  createdAt: "2026-08-04T09:58:00Z"
};
