export class RetryManager {
  private readonly maxRetries = 3;

  shouldRetry(currentRetryCount: number, error: any): boolean {
    // In production, we'd inspect if the error is a FatalError vs RecoverableError
    // Here we just use a basic threshold
    return currentRetryCount < this.maxRetries;
  }

  async backoff(currentRetryCount: number): Promise<void> {
    // Exponential backoff
    const delayMs = Math.pow(2, currentRetryCount) * 100; // Fast for testing
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }
}
