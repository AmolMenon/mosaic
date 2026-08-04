export interface TenantContext {
  tenantId: string;
  workspaceId: string;
  userId: string;
  roles: string[];
}

export interface TenantContextAccessor {
  /**
   * Retrieves the current tenant context from the asynchronous execution scope (e.g. AsyncLocalStorage).
   * Throws if no context is present (enforces strict multi-tenancy).
   */
  get(): TenantContext;
  
  /**
   * Runs the provided function within the given tenant context.
   */
  run<T>(context: TenantContext, fn: () => Promise<T>): Promise<T>;
}
