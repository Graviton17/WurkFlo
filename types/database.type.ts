import { PostgrestError } from "@supabase/supabase-js";

/**
 * Generic response type for database operations
 */
export interface DatabaseResponse<T> {
  data: T | null;
  error: PostgrestError | Error | null;
  success: boolean;
}
