/**
 * Environment variables for Supabase
 * Next.js automatically loads .env files
 * Runtime validation ensures the app fails fast with clear errors
 */

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const SUPABASE_URL = requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_KEY = requireEnv(process.env.NEXT_PUBLIC_SUPABASE_KEY, "NEXT_PUBLIC_SUPABASE_KEY");
export const BASE_URL = requireEnv(process.env.NEXT_PUBLIC_BASE_URL, "NEXT_PUBLIC_BASE_URL");
