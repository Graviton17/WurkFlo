import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Standardized structured JSON logger for the entire application.
 * Enhances observability using Pino.
 * Outputs pretty-printed logs in development and structured JSON in production for Datadog/ELK ingestion.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
        },
      }
    : undefined, // Use standard structured JSON in production
  base: {
    env: process.env.NODE_ENV,
    region: process.env.VERCEL_REGION || "local",
  },
});
