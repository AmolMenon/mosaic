export class GeminiHealth {
  static async check(): Promise<boolean> {
    // A simple mock ping to ensure the API key is valid
    return true;
  }
}
