import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/services/index";
import { BASE_URL } from "@/app/env";

/**
 * GET /api/auth/callback
 * Handle OAuth code exchange after provider sign-in redirect.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createServerComponentClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${BASE_URL}${next}`);
    } else {
      console.error("OAuth callback error:", error);
    }
  }

  // If there's no code or an error, redirect to login with error
  return NextResponse.redirect(`${BASE_URL}/login?error=auth_callback_failed`);
}
