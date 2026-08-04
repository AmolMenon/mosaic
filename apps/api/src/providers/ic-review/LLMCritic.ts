import { RawICReview } from "./RawICSchema";
import { ICCriticExecutionFailure } from "./ICErrors";

export class LLMCritic {
  
  // Simulated deterministic LLM adversarial critique for integration testing
  async execute(prompt: { system: string, user: string }): Promise<RawICReview> {
    
    try {
      const userPayload = JSON.parse(prompt.user);
      const hypothesis = userPayload.hypothesisToReview;
      const allEvidence = userPayload.availableEvidenceCatalog;
      
      // We will look for an evidence point NOT cited by the hypothesis to use as a counterargument
      const uncitedEvidence = allEvidence.filter((e: any) => 
        !hypothesis.supportingEvidenceIds.includes(e.id) && 
        !hypothesis.contradictingEvidenceIds.includes(e.id)
      );
      
      const contradictingId = uncitedEvidence.length > 0 ? uncitedEvidence[0].id : "N/A";
      
      return {
        hypothesisId: hypothesis.id,
        executiveSummary: "The hypothesis rests on optimistic assumptions and ignores key risks.",
        strengths: ["Cites top-line revenue growth correctly."],
        weaknesses: ["Fails to account for margin compression in cited evidence.", "Makes a logical leap regarding market capture."],
        counterarguments: [
          {
            claim: "Margin compression will offset revenue growth entirely.",
            contradictingEvidenceIds: contradictingId !== "N/A" ? [contradictingId] : []
          }
        ],
        missingEvidence: [
          {
            missingInformation: "Customer churn rates",
            impactOnHypothesis: "Without churn data, LTV/CAC assumptions are baseless."
          }
        ],
        questionsForManagement: ["How do you plan to defend margins against new entrants?"],
        risks: ["Price war", "Regulatory fines"],
        alternativeInterpretations: [
          {
            description: "Revenue growth is purely inflation-driven, not volume-driven.",
            supportingEvidenceIds: []
          }
        ],
        recommendedNextStep: "REJECT pending further diligence on unit economics."
      };
      
    } catch (e) {
      throw new ICCriticExecutionFailure("Failed to execute LLM adversarial review");
    }
  }
}
