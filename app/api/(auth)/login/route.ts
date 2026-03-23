import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/index";

/**
 * POST /api/auth/login
 * Authenticate a user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Sign in user
    const result = await authService.signIn({
      email,
      password,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || "Invalid credentials" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      message: "Login successful",
      session: result.data,
    });
  } catch (error) {
    console.error("Error in POST /api/auth/login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
