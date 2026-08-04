import { RawLLMOutput } from "./RawLLMSchema";
import { SchemaValidationFailure } from "./HypothesisErrors";

export class SchemaValidator {
  
  validate(data: any): RawLLMOutput {
    if (!data || !Array.isArray(data.hypotheses)) {
      throw new SchemaValidationFailure("Output must contain a 'hypotheses' array");
    }

    for (const h of data.hypotheses) {
      if (!h.title || !h.description) {
        throw new SchemaValidationFailure("Hypothesis missing title or description");
      }
      if (!Array.isArray(h.supportingEvidenceIds) || !Array.isArray(h.contradictingEvidenceIds)) {
        throw new SchemaValidationFailure("Evidence IDs must be arrays");
      }
      if (!Array.isArray(h.assumptions) || !Array.isArray(h.risks) || !Array.isArray(h.missingEvidence)) {
        throw new SchemaValidationFailure("Assumptions, risks, and missingEvidence must be arrays");
      }
    }

    return data as RawLLMOutput;
  }
}
