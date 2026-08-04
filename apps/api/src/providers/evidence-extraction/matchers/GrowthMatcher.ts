import { CandidateEvidence, EvidenceMatcher } from "../EvidenceMatcherRegistry";
import { EvidenceType } from "../EvidenceTypeRegistry";

export class GrowthMatcher implements EvidenceMatcher {
  matcherName = "GrowthMatcher";
  ruleVersion = "1.0.0";
  
  // A simplistic deterministic pattern to extract statements like "Revenue grew 18%"
  private regex = /([A-Za-z]+)\s+(?:grew|increased|rose|jumped)\s+((?:\d+)?\.?\d+%)?/ig;

  extract(chunk: any, entityMentions: any[]): CandidateEvidence[] {
    const evidenceList: CandidateEvidence[] = [];
    const text = chunk.payload?.text || "";

    let match;
    while ((match = this.regex.exec(text)) !== null) {
      const statement = match[0];
      const metricOrSubject = match[1];
      const percentage = match[2];

      // Find if we have canonical entities covering these terms in this chunk
      const referencedEntities = new Set<string>();
      for (const m of entityMentions) {
        if (statement.includes(m.payload?.matchedText)) {
          referencedEntities.add(m.payload?.entityId);
        }
      }

      evidenceList.push({
        evidenceType: EvidenceType.GROWTH_STATEMENT,
        statement: statement,
        supportingText: text.substring(Math.max(0, match.index - 50), Math.min(text.length, match.index + statement.length + 50)),
        chunkId: chunk.id,
        referencedEntityIds: Array.from(referencedEntities),
        extractionRule: "Regex_Growth_V1",
        matcherName: this.matcherName,
        ruleVersion: this.ruleVersion
      });
    }

    return evidenceList;
  }
}
