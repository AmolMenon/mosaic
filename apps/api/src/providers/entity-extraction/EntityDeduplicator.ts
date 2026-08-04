import { CandidateMention } from "./matchers/EntityMatcher";
import * as crypto from "crypto";

export interface CanonicalEntity {
  id: string;
  canonicalName: string;
  entityType: string;
  normalizedValue: string;
  aliases: Set<string>;
  mentions: CandidateMention[];
}

export class EntityDeduplicator {
  
  deduplicate(mentions: CandidateMention[], normalizer: any, resolver: any): CanonicalEntity[] {
    const entityMap = new Map<string, CanonicalEntity>();

    for (const mention of mentions) {
      const normalized = normalizer.normalize(mention);
      const canonical = resolver.resolve(normalized, mention.entityType);

      // Deterministic ID logic
      const hash = crypto.createHash('sha256');
      hash.update(mention.entityType);
      hash.update(canonical);
      const entityId = `ent_${hash.digest('hex').substring(0, 16)}`;

      if (!entityMap.has(entityId)) {
        entityMap.set(entityId, {
          id: entityId,
          canonicalName: canonical,
          entityType: mention.entityType,
          normalizedValue: normalized,
          aliases: new Set([mention.matchedText]),
          mentions: []
        });
      }

      const entity = entityMap.get(entityId)!;
      entity.aliases.add(mention.matchedText);
      entity.mentions.push(mention);
    }

    return Array.from(entityMap.values());
  }
}
