export interface PromptTemplate {
  version: string;
  name: string;
  template: string;
  variables: string[];
}

export interface PromptManager {
  /**
   * Retrieves a prompt template by name and version.
   */
  getTemplate(name: string, version: string): Promise<PromptTemplate>;

  /**
   * Compiles a template with the provided variables.
   * Throws if a required variable is missing.
   */
  compile(template: PromptTemplate, variables: Record<string, string>): string;

  /**
   * Audits the prompt usage for traceability.
   */
  logUsage(name: string, version: string, executionId: string): Promise<void>;
}
