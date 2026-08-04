import { CanonicalEntity } from "../EntityDeduplicator";
import { RelationshipRule, ExtractedRelationship } from "../RelationshipRuleRegistry";

export class MetricMeasuredInPercentageRule implements RelationshipRule {
  
  evaluate(entities: CanonicalEntity[]): ExtractedRelationship[] {
    const relationships: ExtractedRelationship[] = [];
    
    const percentages = entities.filter(e => e.entityType === 'Percentage');
    const companies = entities.filter(e => e.entityType === 'Company'); // Proxy for metric source

    // A real implementation evaluates proximity inside the chunk (using mention offsets)
    // For this mock deterministic rule, we'll associate percentages to the nearest company in reading order
    if (percentages.length > 0 && companies.length > 0) {
      // Connect all percentages to the first company for the demo
      for (const perc of percentages) {
        relationships.push({
          sourceEntityId: companies[0].id,
          targetEntityId: perc.id,
          relationshipType: 'MEASURED_AS',
          confidence: 0.8
        });
      }
    }
    
    return relationships;
  }
}
