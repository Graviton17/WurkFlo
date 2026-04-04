import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { withApiSetup } from "@/lib/api-wrapper";
import { LoginSchema } from "@/types/validation";
import { authSyncService } from "@/services";

/**
 * POST /api/login
 * Authenticate a user
 */
export const POST = withApiSetup({
  requireAuth: false,
  schema: LoginSchema,
  rateLimit: { limit: 5, windowMs: 60000 }, // 5 requests per minute
  handler: async ({ validatedData }) => {
    const result = await auth.signIn(validatedData!);

    if (!result.success || !result.data?.user) {
      return NextResponse.json(
        {
          success: false,
          error: result.error?.message || "Invalid credentials",
        },
        { status: 401 },
      );
    }

    // Sync public.users with auth table on login
    await authSyncService.syncUser(result.data.user);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      session: result.data,
    });
  },
});
