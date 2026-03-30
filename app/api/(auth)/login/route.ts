import { NextResponse } from "next/server";
import { authService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";
import { LoginSchema } from "@/types/validation";

/**
 * POST /api/auth/login
 * Authenticate a user
 */
export const POST = withApiSetup({
  requireAuth: false,
  schema: LoginSchema,
  rateLimit: { limit: 5, windowMs: 60000 }, // 5 requests per minute
  handler: async ({ validatedData }) => {
    const result = await authService.signIn(validatedData!);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error?.message || "Invalid credentials" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      session: result.data,
    });
  }
});
