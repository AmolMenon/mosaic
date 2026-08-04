import { GroupedContext } from "./EvidenceGrouper";

export class HypothesisPlanner {
  
  buildPrompt(groupedContext: GroupedContext): { system: string, user: string } {
    const systemPrompt = `You are a highly disciplined investment associate.
Your task is to synthesize competing hypotheses from the provided evidence.
You must return your response STRICTLY as a JSON array matching the RawLLMOutput schema.
DO NOT invent facts. DO NOT invent entities.
Every factual claim MUST cite a specific Evidence ID provided below.`;

    const userPrompt = JSON.stringify({
      instructions: "Generate 2 competing hypotheses based on this evidence.",
      evidence: groupedContext
    }, null, 2);

    return {
      system: systemPrompt,
      user: userPrompt
    };
  }
}
