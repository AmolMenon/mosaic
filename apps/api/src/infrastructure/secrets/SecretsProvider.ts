export interface SecretsProvider {
  /**
   * Retrieves a secret by key. Throws if the secret is missing or the provider is unreachable.
   */
  getSecret(key: string): Promise<string>;
  
  /**
   * Retrieves a secret, returning a default value if missing instead of throwing.
   */
  getSecretOrDefault(key: string, defaultValue: string): Promise<string>;
  
  /**
   * Re-fetches secrets to handle rotation without restarting the Node process.
   */
  refreshCache(): Promise<void>;
}
