import { z } from "zod";
import { logger } from "../../utils/logger";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3001"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),
});

export function validateEnv() {
  try {
    envSchema.parse(process.env);
    logger.info("Environment variables validated successfully.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error("Environment variables validation failed", { errors: error.errors });
    }
    logger.error("Missing required environment variables. Shutting down.");
    process.exit(1);
  }
}
