// A stub mapper if needed to convert domain objects into Gemini chat formats
export class GeminiMapper {
  static toGeminiContent(prompt: string): any {
    return {
      parts: [{ text: prompt }]
    };
  }
}
