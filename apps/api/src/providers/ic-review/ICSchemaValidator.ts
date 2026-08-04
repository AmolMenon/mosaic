import { RawICReview } from "./RawICSchema";
import { ICSchemaValidationFailure } from "./ICErrors";

export class ICSchemaValidator {
  
  validate(data: any): RawICReview {
    if (!data || !data.hypothesisId) {
      throw new ICSchemaValidationFailure("Output must contain a 'hypothesisId'");
    }

    if (!data.executiveSummary || !data.recommendedNextStep) {
      throw new ICSchemaValidationFailure("Missing required narrative fields");
    }

    if (!Array.isArray(data.counterarguments)) {
      throw new ICSchemaValidationFailure("Counterarguments must be an array");
    }

    if (!Array.isArray(data.missingEvidence)) {
      throw new ICSchemaValidationFailure("Missing Evidence (Diligence Gaps) must be an array");
    }
    
    // Check for duplicate counterarguments
    const seenClaims = new Set<string>();
    for (const ca of data.counterarguments) {
      if (seenClaims.has(ca.claim)) {
        throw new ICSchemaValidationFailure(`Duplicate counterargument detected: ${ca.claim}`);
      }
      seenClaims.add(ca.claim);
    }

    return data as RawICReview;
  }
}
