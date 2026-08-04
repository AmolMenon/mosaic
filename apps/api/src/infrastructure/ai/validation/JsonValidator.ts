import { ZodSchema, ZodError } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: ZodError;
  repairAttempted: boolean;
}

export interface JsonValidator {
  /**
   * Validates raw LLM string output against a strict JSON schema.
   * Handles markdown stripping (e.g., ```json ... ```).
   */
  validate<T>(rawPayload: string, schema: ZodSchema<T>): ValidationResult<T>;

  /**
   * Attempts to auto-repair malformed JSON (e.g., missing quotes, trailing commas)
   * before rejecting the payload.
   */
  repairAndValidate<T>(rawPayload: string, schema: ZodSchema<T>): ValidationResult<T>;
}
