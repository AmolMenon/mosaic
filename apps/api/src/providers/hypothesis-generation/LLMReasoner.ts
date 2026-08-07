import { RawLLMOutput } from "./RawLLMSchema";
import { LLMExecutionFailure } from "./HypothesisErrors";
import { OpenAiProvider } from "../../infrastructure/ai/providers/OpenAiProvider";

export class LLMReasoner {
  
  async execute(prompt: { system: string, user: string }): Promise<RawLLMOutput> {
    const provider = new OpenAiProvider();
    
    try {
      const result = await provider.generateJson(
        `${prompt.system}\n\n${prompt.user}`,
        { model: 'gpt-4o', temperature: 0.2, maxTokens: 4096 }
      );
      
      const parsed = JSON.parse(result.text);
      if (!parsed.hypotheses) {
        return { hypotheses: [] };
      }
      return parsed;
    } catch (e: any) {
      throw new LLMExecutionFailure(`Failed to execute LLM reasoning: ${e.message}`);
    }
  }
}
