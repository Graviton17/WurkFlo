import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BASE_URL } from "@/app/env";

/**
 * GET /api/callback
 * Handle both:
 *  1. OAuth code exchange after provider sign-in redirect (has `code` param)
 *  2. Email confirmation after signup (has `token_hash` + `type` params)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  // ── 1. OAuth code exchange ──
  if (code) {
    const redirectPath = await auth.handleOAuthCallback(code, next);
    return NextResponse.redirect(`${BASE_URL}${redirectPath}`);
  }

  // ── 2. Email confirmation (signup / magic-link / recovery) ──
  if (token_hash && type) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error, data } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as "signup" | "email" | "recovery" | "invite" | "magiclink" | "email_change",
      });

      if (!error && data?.user) {
        // Sync the confirmed user to public.users
        try {
          const { authSyncService } = await import("@/services");
          await authSyncService.syncUser(data.user);
        } catch (syncErr) {
          const { logger } = await import("@/lib/logger");
          logger.error({ err: syncErr }, "Email confirm syncUser threw");
        }

        // Redirect: use `next` param if provided, otherwise default to onboarding
        const redirectPath = next || "/onboarding";
        return NextResponse.redirect(`${BASE_URL}${redirectPath}`);
      }

      // verifyOtp returned an error
      const { logger } = await import("@/lib/logger");
      logger.error({ err: error }, "Email confirmation verifyOtp failed");
    } catch (err) {
      const { logger } = await import("@/lib/logger");
      logger.error({ err }, "Email confirmation threw");
    }
  }

  // If there's no code, no token_hash, or an error, redirect to login with error
  return NextResponse.redirect(`${BASE_URL}/login?error=auth_callback_failed`);
}
