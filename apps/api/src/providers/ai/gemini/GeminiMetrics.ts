import { logger } from "../../../utils/logger";

export class GeminiMetrics {
  static record(latencyMs: number, promptTokens: number, completionTokens: number, model: string, requestId: string): void {
    logger.info(`[GeminiMetrics] Request ${requestId} | Model: ${model} | Latency: ${latencyMs}ms | Tokens: ${promptTokens} prompt, ${completionTokens} completion`);
  }
}
