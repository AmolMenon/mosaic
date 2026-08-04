import { EvidenceType } from "./EvidenceTypeRegistry";

export interface CandidateEvidence {
  evidenceType: EvidenceType;
  statement: string;
  supportingText: string;
  chunkId: string;
  referencedEntityIds: string[];
  extractionRule: string;
  matcherName: string;
  ruleVersion: string;
}

export interface EvidenceMatcher {
  matcherName: string;
  ruleVersion: string;
  extract(chunk: any, entityMentions: any[]): CandidateEvidence[];
}

export class EvidenceMatcherRegistry {
  private matchers: EvidenceMatcher[] = [];

  register(matcher: EvidenceMatcher): void {
    this.matchers.push(matcher);
  }

  getMatchers(): EvidenceMatcher[] {
    return this.matchers;
  }
}
