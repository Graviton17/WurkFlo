import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { withApiSetup } from "@/lib/api-wrapper";
import { CreateUserSchema } from "@/types/validation";
import { authSyncService } from "@/services";

/**
 * POST /api/signup
 * Register a new user
 */
export const POST = withApiSetup({
  requireAuth: false,
  schema: CreateUserSchema,
  rateLimit: { limit: 5, windowMs: 60000 }, // 5 requests per minute
  handler: async ({ validatedData }) => {
    const result = await auth.signUp(validatedData!);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error?.message || "Failed to sign up" },
        { status: 400 },
      );
    }

    // Sync public.users with auth table on signup
    await authSyncService.syncUser(result.data);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: result.data,
      },
      { status: 201 },
    );
  },
});
