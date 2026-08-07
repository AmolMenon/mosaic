import { CanonicalEntity } from "./EntityDeduplicator";

export interface RelationshipRule {
  evaluate(entities: CanonicalEntity[]): ExtractedRelationship[];
}

export interface ExtractedRelationship {
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: string;
  confidence: number;
}

export class RelationshipRuleRegistry {
  private rules: RelationshipRule[] = [];

  register(rule: RelationshipRule): void {
    this.rules.push(rule);
  }

  getRules(): RelationshipRule[] {
    return this.rules;
  }
}
