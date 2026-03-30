import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/services/server.service";
import { userService } from "@/services/index";
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
    const supabase = await createServerComponentClient();
    const { error, data: sessionData } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && sessionData?.user) {
      let redirectPath = next;
      
      if (!redirectPath) {
        // Check if user exists in the database
        const dbUser = await userService.getUserById(sessionData.user.id);
        
        // If they don't exist in the users table, send to onboarding
        if (!dbUser.success || !dbUser.data) {
          redirectPath = "/onboarding";
        } else {
          redirectPath = "/dashboard";
        }
      }
      
      return NextResponse.redirect(`${BASE_URL}${redirectPath}`);
    } else {
      console.error("OAuth callback error:", error);
    }
  }

  // If there's no code or an error, redirect to login with error
  return NextResponse.redirect(`${BASE_URL}/login?error=auth_callback_failed`);
}
