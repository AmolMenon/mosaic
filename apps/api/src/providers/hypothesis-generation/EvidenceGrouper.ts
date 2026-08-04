import { ReasoningContext } from "./ReasoningContextBuilder";

export interface GroupedContext {
  financialEvidence: any[];
  commercialEvidence: any[];
  riskEvidence: any[];
  otherEvidence: any[];
}

export class EvidenceGrouper {
  group(context: ReasoningContext): GroupedContext {
    const grouped: GroupedContext = {
      financialEvidence: [],
      commercialEvidence: [],
      riskEvidence: [],
      otherEvidence: []
    };

    for (const ev of context.evidence) {
      if (ev.category.includes("Financial") || ev.category.includes("Pricing")) {
        grouped.financialEvidence.push(ev);
      } else if (ev.category.includes("Market") || ev.category.includes("Competition") || ev.category.includes("Growth")) {
        grouped.commercialEvidence.push(ev);
      } else if (ev.category.includes("Risk")) {
        grouped.riskEvidence.push(ev);
      } else {
        grouped.otherEvidence.push(ev);
      }
    }

    return grouped;
  }
}
