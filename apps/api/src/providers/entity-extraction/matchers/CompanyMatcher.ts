import { CandidateMention, EntityMatcher } from "./EntityMatcher";

export class CompanyMatcher implements EntityMatcher {
  // Simplistic dictionary for deterministic mock
  private dict = ["L Catterton", "L Catterton Partners", "LC", "Acme Corp", "Nykaa", "Boat"];

  extract(chunk: any): CandidateMention[] {
    const mentions: CandidateMention[] = [];
    const text = chunk.payload.text || "";
    
    const sortedDict = [...this.dict].sort((a, b) => b.length - a.length);
    let tempText = text;
    for (const company of sortedDict) {
      const idx = tempText.indexOf(company);
      if (idx !== -1) {
        mentions.push({
          matchedText: company,
          entityType: "Company",
          chunkId: chunk.id,
          pageNumber: chunk.payload.pageNumber || 0,
          readingOrder: chunk.payload.readingOrder || 0,
          offsets: [idx, idx + company.length],
          boundingBox: chunk.payload.boundingBox,
          contextWindow: text.substring(Math.max(0, idx - 30), Math.min(text.length, idx + company.length + 30)),
          confidence: 0.95
        });
        tempText = tempText.replace(company, ' '.repeat(company.length));
      }
    }
    
    return mentions;
  }
}
