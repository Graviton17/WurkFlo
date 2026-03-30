import { createServerComponentClient } from "./server.service";
import type { User } from "@supabase/supabase-js";

/**
 * Reusable authentication helper for API Route Handlers.
 * Extracts and validates the authenticated user from the request cookies.
 *
 * @returns The authenticated Supabase User, or null if not authenticated.
 *
 * Usage in route handlers:
 *   const user = await getAuthenticatedUser();
 *   if (!user) {
 *     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 *   }
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}
