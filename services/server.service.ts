import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_KEY } from "@/app/env";

/**
 * Create a Supabase client for use in Server Components and Route Handlers.
 * Reads cookies from the request (read-only).
 */
export async function createServerComponentClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

/**
 * Create a Supabase client for use in Next.js Middleware.
 * Reads and writes cookies on the request/response pair.
 */
export function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse,
) {
  return createSupabaseServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}
