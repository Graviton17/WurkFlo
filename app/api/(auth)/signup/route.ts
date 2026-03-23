import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/index";

/**
 * POST /api/auth/signup
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, metadata } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Sign up user
    const result = await authService.signUp({
      email,
      password,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message || "Failed to sign up" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: result.data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/auth/signup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
