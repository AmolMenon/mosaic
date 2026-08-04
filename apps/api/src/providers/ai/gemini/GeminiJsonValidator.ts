import { z, ZodSchema } from 'zod';

export class GeminiJsonValidator {
  static validate<T>(payload: string, schema: ZodSchema<T>): { success: boolean; data?: T; error?: any; repairAttempted: boolean } {
    let cleanPayload = payload.trim();
    let repairAttempted = false;

    // Strip markdown blocks if present
    if (cleanPayload.startsWith('```json')) {
      cleanPayload = cleanPayload.replace(/^```json\n/, '').replace(/\n```$/, '');
      repairAttempted = true;
    }

    try {
      const parsed = JSON.parse(cleanPayload);
      const data = schema.parse(parsed);
      return { success: true, data, repairAttempted };
    } catch (error) {
      return { success: false, error, repairAttempted };
    }
  }
}
