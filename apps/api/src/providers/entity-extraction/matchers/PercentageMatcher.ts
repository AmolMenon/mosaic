import { CandidateMention, EntityMatcher } from "./EntityMatcher";

export class PercentageMatcher implements EntityMatcher {
  private regex = /((?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?)\s*%/g;

  extract(chunk: any): CandidateMention[] {
    const mentions: CandidateMention[] = [];
    const text = chunk.payload.text || "";
    
    let match;
    while ((match = this.regex.exec(text)) !== null) {
      mentions.push({
        matchedText: match[0],
        entityType: "Percentage",
        chunkId: chunk.id,
        pageNumber: chunk.payload.pageNumber || 0,
        readingOrder: chunk.payload.readingOrder || 0,
        offsets: [match.index, match.index + match[0].length],
        boundingBox: chunk.payload.boundingBox,
        contextWindow: text.substring(Math.max(0, match.index - 30), Math.min(text.length, match.index + match[0].length + 30)),
        confidence: 1.0 // Deterministic regex
      });
    }
    
    return mentions;
  }
}
