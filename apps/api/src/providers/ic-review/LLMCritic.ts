import { RawICReview } from "./RawICSchema";
import { ICCriticExecutionFailure } from "./ICErrors";
import { AnthropicProvider } from "../../infrastructure/ai/providers/AnthropicProvider";

export class LLMCritic {
  
  async execute(prompt: { system: string, user: string }): Promise<RawICReview> {
    const provider = new AnthropicProvider();
    
    try {
      const result = await provider.generateJson(
        `${prompt.system}\n\n${prompt.user}`,
        { model: 'claude-3-5-sonnet-latest', temperature: 0.1, maxTokens: 4096 }
      );
      
      const parsed = JSON.parse(result.text);
      if (!parsed.hypothesisId) {
        throw new Error("Invalid schema returned by LLM");
      }
      return parsed;
    } catch (e: any) {
      throw new ICCriticExecutionFailure(`Failed to execute LLM adversarial review: ${e.message}`);
    }
  }
}
