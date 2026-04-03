import { NextResponse } from "next/server";
import { withApiSetup } from "@/lib/api-wrapper";
import { authSyncService } from "@/services";

/**
 * POST /api/auth/sync
 * Sync the currently authenticated Supabase auth user to public.users.
 * Called client-side after OAuth sign-in completes via PKCE.
 */
export const POST = withApiSetup({
  requireAuth: true,
  handler: async ({ user }) => {
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No authenticated user" },
        { status: 401 },
      );
    }

    const result = await authSyncService.syncUser(user);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to sync user" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  },
});
