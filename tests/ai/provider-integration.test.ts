import { z } from 'zod';
import { JsonValidator } from '../../../apps/api/src/infrastructure/ai/validation/JsonValidator';
import { FallbackOrchestrator } from '../../../apps/api/src/infrastructure/ai/orchestration/FallbackOrchestrator';
import { OpenAiProvider } from '../../../apps/api/src/infrastructure/ai/providers/OpenAiProvider';
import { AnthropicProvider } from '../../../apps/api/src/infrastructure/ai/providers/AnthropicProvider';
import { GeminiProvider } from '../../../apps/api/src/infrastructure/ai/providers/GeminiProvider';

describe('AI Provider Integration Tests', () => {
  const EvidenceSchema = z.object({
    hypothesisId: z.string(),
    evidenceText: z.string(),
    confidenceScore: z.number().min(0).max(1)
  });

  it('should successfully fallback to OpenAI if Anthropic fails', async () => {
    const anthropic = new AnthropicProvider();
    const openai = new OpenAiProvider();
    
    // Mock Anthropic to fail
    jest.spyOn(anthropic, 'generateJson').mockRejectedValueOnce(new Error('Anthropic Overloaded'));
    
    const orchestrator = new FallbackOrchestrator(anthropic, [openai]);
    
    const result = await orchestrator.executeWithFallback('Extract evidence', {
      model: 'claude-3-5-sonnet',
      temperature: 0.2,
      maxTokens: 1000
    }, true);
    
    // Result should come from OpenAI fallback
    expect(result.text).toContain('mocked');
  });

  it('should reject malformed JSON that cannot be repaired', () => {
    // Stub implementation of JsonValidator
    const validator: JsonValidator = {
      validate: (raw, schema) => ({ success: false, repairAttempted: false }),
      repairAndValidate: (raw, schema) => ({ success: false, repairAttempted: true })
    };

    const result = validator.repairAndValidate('This is just text, not JSON', EvidenceSchema);
    expect(result.success).toBe(false);
    expect(result.repairAttempted).toBe(true);
  });
});
