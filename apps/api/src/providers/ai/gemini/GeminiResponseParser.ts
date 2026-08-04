export class GeminiResponseParser {
  static parseText(response: any): string {
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No candidates in Gemini response');
    }
    
    const candidate = response.candidates[0];
    if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
      return candidate.content.parts[0].text || '';
    }
    
    return '';
  }

  static parseUsage(response: any): { promptTokens: number; completionTokens: number } {
    return {
      promptTokens: response.usageMetadata?.promptTokenCount || 0,
      completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
    };
  }
}
