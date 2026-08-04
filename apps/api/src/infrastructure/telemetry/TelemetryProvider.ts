import { trace, context, Span, SpanStatusCode } from '@opentelemetry/api';

export interface TelemetryProvider {
  /**
   * Starts a new span tied to the current execution trace ID.
   */
  startSpan(name: string, attributes?: Record<string, string | number>): Span;
  
  /**
   * Records an error against the active span and sets its status to ERROR.
   */
  recordError(span: Span, error: Error): void;
  
  /**
   * Ends the span.
   */
  endSpan(span: Span): void;
  
  /**
   * Executes a callback within a managed span.
   */
  withSpan<T>(name: string, fn: (span: Span) => Promise<T>): Promise<T>;
}
