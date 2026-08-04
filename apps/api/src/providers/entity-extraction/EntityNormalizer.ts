import { CandidateMention } from "./matchers/EntityMatcher";

export class EntityNormalizer {
  normalize(mention: CandidateMention): string {
    let text = mention.matchedText.trim();
    
    if (mention.entityType === 'Company') {
      text = text.replace(/,?\s*(Inc\.|LLC|Corp\.|Partners|Group)$/i, '').trim();
    }
    
    // Simplistic normalization for percentages
    if (mention.entityType === 'Percentage') {
      text = text.replace(/\s/g, '');
    }

    return text;
  }
}
