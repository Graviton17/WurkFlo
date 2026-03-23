import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY } from "@/app/env";

/**
 * Supabase Client Singleton
 * This ensures only one instance of the Supabase client is created
 */
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Get or create the Supabase client instance
 * @returns Supabase client instance
 */
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error("Supabase URL and Key must be provided");
    }

    supabaseClient = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
  }

  return supabaseClient;
};

/**
 * Export the default client instance
 */
export const supabase = getSupabaseClient();
