import { ICReviewContext } from "./ICReviewContextBuilder";

export class ICReviewPlanner {
  
  buildPrompt(context: ICReviewContext): { system: string, user: string } {
    const systemPrompt = `You are a skeptical Investment Committee member.
Your goal is to aggressively challenge the provided hypothesis.
Assume the hypothesis is incomplete or incorrect until proven otherwise.
Identify weaknesses, generate counterarguments, and flag missing evidence.
You MUST return structured JSON adhering exactly to the RawICReview schema.
DO NOT invent evidence. All factual claims must cite Evidence IDs.
DO NOT strengthen the hypothesis without explicit evidence.`;

    const userPrompt = JSON.stringify({
      hypothesisToReview: context.hypothesis,
      citedEvidence: context.citedEvidence,
      availableEvidenceCatalog: context.allEvidence // Allowing the LLM to find contradictory evidence the hypothesis author missed
    }, null, 2);

    return {
      system: systemPrompt,
      user: userPrompt
    };
  }
}
