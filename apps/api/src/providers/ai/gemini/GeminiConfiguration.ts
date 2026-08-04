export interface GeminiConfiguration {
  model: string;
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
}

export const defaultGeminiConfiguration: GeminiConfiguration = {
  model: 'gemini-2.5-pro',
  temperature: 0.2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};
