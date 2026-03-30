import { NextResponse } from "next/server";
import { authService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";
import { CreateUserSchema } from "@/types/validation";

/**
 * POST /api/auth/signup
 * Register a new user
 */
export const POST = withApiSetup({
  requireAuth: false,
  schema: CreateUserSchema,
  rateLimit: { limit: 5, windowMs: 60000 }, // 5 requests per minute
  handler: async ({ validatedData }) => {
    const result = await authService.signUp(validatedData!);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error?.message || "Failed to sign up" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: result.data,
      },
      { status: 201 },
    );
  }
});
