import { ScoredEvidence } from "./EvidenceScorer";
import * as crypto from "crypto";

export interface CanonicalEvidence extends ScoredEvidence {
  evidenceId: string;
}

export class EvidenceDeduplicator {
  
  deduplicate(evidenceList: ScoredEvidence[]): CanonicalEvidence[] {
    const evidenceMap = new Map<string, CanonicalEvidence>();

    for (const ev of evidenceList) {
      // Deterministic ID logic
      const hash = crypto.createHash('sha256');
      hash.update(ev.evidenceType);
      hash.update(ev.statement);
      hash.update(ev.chunkId);
      hash.update(ev.referencedEntityIds.sort().join(","));
      const evidenceId = `ev_${hash.digest('hex').substring(0, 16)}`;

      // In a real deduplication we'd merge supporting text offsets or keep the highest confidence
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(evidenceId, {
          ...ev,
          evidenceId
        });
      } else {
        const existing = evidenceMap.get(evidenceId)!;
        if (ev.confidenceScore > existing.confidenceScore) {
          existing.confidenceScore = ev.confidenceScore;
        }
      }
    }

    return Array.from(evidenceMap.values());
  }
}
