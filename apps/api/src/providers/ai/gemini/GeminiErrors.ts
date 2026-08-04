export class GeminiErrors {
  static mapGoogleError(error: any): Error {
    const message = error.message || 'Unknown Gemini Error';
    const status = error.status || 500;

    if (status === 429) {
      return new Error(`RateLimitError: ${message}`);
    }
    if (status === 401 || status === 403) {
      return new Error(`AuthenticationError: ${message}`);
    }
    if (status >= 500) {
      return new Error(`TransientProviderError: ${message}`);
    }
    return new Error(`PermanentProviderError: ${message}`);
  }
}
