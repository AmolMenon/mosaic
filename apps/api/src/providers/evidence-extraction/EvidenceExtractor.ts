import { EvidenceMatcherRegistry, CandidateEvidence } from "./EvidenceMatcherRegistry";

export class EvidenceExtractor {
  constructor(private registry: EvidenceMatcherRegistry) {}

  extractAll(chunks: any[], mentions: any[]): CandidateEvidence[] {
    const allEvidence: CandidateEvidence[] = [];
    
    for (const chunk of chunks) {
      // Find mentions specifically within this chunk for localized rule evaluation
      const chunkMentions = mentions.filter(m => m.payload?.chunkId === chunk.id);
      
      for (const matcher of this.registry.getMatchers()) {
        const evidence = matcher.extract(chunk, chunkMentions);
        allEvidence.push(...evidence);
      }
    }
    
    return allEvidence;
  }
}
