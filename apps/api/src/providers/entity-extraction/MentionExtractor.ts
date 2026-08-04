import { MatcherRegistry } from "./MatcherRegistry";
import { CandidateMention } from "./matchers/EntityMatcher";

export class MentionExtractor {
  constructor(private registry: MatcherRegistry) {}

  extractAll(chunks: any[]): CandidateMention[] {
    const allMentions: CandidateMention[] = [];
    
    for (const chunk of chunks) {
      for (const matcher of this.registry.getMatchers()) {
        const mentions = matcher.extract(chunk);
        allMentions.push(...mentions);
      }
    }
    
    return allMentions;
  }
}
