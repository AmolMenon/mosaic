import { RelationshipRuleRegistry, ExtractedRelationship } from "./RelationshipRuleRegistry";
import { CanonicalEntity } from "./EntityDeduplicator";

export class RelationshipExtractor {
  constructor(private registry: RelationshipRuleRegistry) {}

  extractAll(entities: CanonicalEntity[]): ExtractedRelationship[] {
    const relationships: ExtractedRelationship[] = [];
    
    for (const rule of this.registry.getRules()) {
      relationships.push(...rule.evaluate(entities));
    }
    
    return relationships;
  }
}
