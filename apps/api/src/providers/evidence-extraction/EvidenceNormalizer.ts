import { CandidateEvidence } from "./EvidenceMatcherRegistry";

export class EvidenceNormalizer {
  normalize(evidence: CandidateEvidence): CandidateEvidence {
    // Normalization logic: trim whitespace, standardize standard metrics text
    evidence.statement = evidence.statement.trim().replace(/\s+/g, ' ');
    return evidence;
  }
}
