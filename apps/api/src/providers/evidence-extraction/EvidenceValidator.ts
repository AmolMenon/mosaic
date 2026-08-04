import { CandidateEvidence } from "./EvidenceMatcherRegistry";

export class EvidenceValidator {
  
  validate(evidence: CandidateEvidence): boolean {
    if (!evidence.statement || evidence.statement.length < 5) return false;
    if (!evidence.supportingText) return false;
    if (!evidence.chunkId) return false;
    
    // An evidence proposal should reference at least one canonical entity
    if (!evidence.referencedEntityIds || evidence.referencedEntityIds.length === 0) return false;
    
    return true;
  }
}
