import { RawLLMOutput } from "./RawLLMSchema";
import { LLMExecutionFailure } from "./HypothesisErrors";

export class LLMReasoner {
  
  // Simulated deterministic LLM reasoning for integration testing
  async execute(prompt: { system: string, user: string }): Promise<RawLLMOutput> {
    
    // In a real provider, we would call the OpenAI/Anthropic/Gemini SDK here
    // and enforce structured output (JSON mode or tool calling).
    
    // For deterministic simulation within this mock provider, we parse the prompt 
    // and generate a valid JSON payload referencing the supplied evidence.
    
    try {
      const userPayload = JSON.parse(prompt.user);
      const evidenceList = [
        ...userPayload.evidence.financialEvidence,
        ...userPayload.evidence.commercialEvidence,
        ...userPayload.evidence.riskEvidence,
        ...userPayload.evidence.otherEvidence
      ];
      
      const ids = evidenceList.map(e => e.id).filter(id => !!id);
      
      // If we have at least 2 pieces of evidence, generate a mock response using them
      if (ids.length >= 1) {
        return {
          hypotheses: [
            {
              title: "Growth accelerates via market capture",
              description: "The company will outpace competitors by capturing market share.",
              supportingEvidenceIds: [ids[0]],
              contradictingEvidenceIds: ids.length > 1 ? [ids[1]] : [],
              assumptions: ["Market size remains stable"],
              risks: ["Competitor retaliation"],
              missingEvidence: ["Customer churn rate"],
              confidenceExplanation: "Supported by recent revenue growth data, but contradicted by pricing pressure."
            },
            {
              title: "Margin compression limits upside",
              description: "Growth will be offset by increasing costs and price wars.",
              supportingEvidenceIds: ids.length > 1 ? [ids[1]] : [],
              contradictingEvidenceIds: [ids[0]],
              assumptions: ["Costs continue to scale linearly"],
              risks: ["Unforeseen regulatory fines"],
              missingEvidence: ["Detailed COGS breakdown"],
              confidenceExplanation: "Significant pricing pressure evident, counteracting top-line growth."
            }
          ]
        };
      }
      
      return { hypotheses: [] };
    } catch (e) {
      throw new LLMExecutionFailure("Failed to execute LLM reasoning");
    }
  }
}
