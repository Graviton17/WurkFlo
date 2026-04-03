import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { BASE_URL } from "@/app/env";

/**
 * GET /api/auth/callback
 * Handle OAuth code exchange after provider sign-in redirect.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const redirectPath = await auth.handleOAuthCallback(code, next);
    return NextResponse.redirect(`${BASE_URL}${redirectPath}`);
  }

  // If there's no code or an error, redirect to login with error
  return NextResponse.redirect(`${BASE_URL}/login?error=auth_callback_failed`);
}
