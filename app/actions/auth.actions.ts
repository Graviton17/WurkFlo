"use server";

import { auth } from "@/lib/auth";
import { authSyncService } from "@/services";
import { LoginSchema, CreateUserSchema, ForgotPasswordSchema, ResetPasswordSchema } from "@/types/validation";
import type { ActionResult } from "@/types/index";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

export async function loginAction(data: Record<string, unknown>): Promise<ActionResult<{ session: Session | null; message: string }>> {
  const parsed = LoginSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, data: null, error: "Invalid credentials" };
  }

  const result = await auth.signIn(parsed.data);

  if (!result.success || !result.data?.user) {
    return { success: false, data: null, error: result.error?.message || "Invalid credentials" };
  }

  // Sync public.users with auth table on login
  await authSyncService.syncUser(result.data.user);

  return { success: true, data: { session: result.data, message: "Login successful" } };
}

export async function signupAction(data: Record<string, unknown>): Promise<ActionResult<{ message: string }>> {
  const parsed = CreateUserSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, data: null, error: "Invalid signup data" };
  }

  const result = await auth.signUp(parsed.data);

  if (!result.success || !result.data) {
    return { success: false, data: null, error: result.error?.message || "Failed to sign up" };
  }

  // Sync public.users with auth table on signup
  await authSyncService.syncUser(result.data);

  return { success: true, data: { message: "User registered successfully" } };
}

export async function syncUserAction(): Promise<ActionResult<{ success: boolean }>> {
  const user = await auth.getUser();
  if (!user) {
    return { success: false, data: null, error: "No authenticated user" };
  }

  const result = await authSyncService.syncUser(user);

  if (!result.success || !result.data) {
    return { success: false, data: null, error: "Failed to sync user" };
  }

  return { success: true, data: { success: true } };
}

export async function forgotPasswordAction(data: Record<string, unknown>): Promise<ActionResult<{ message: string }>> {
  const parsed = ForgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, data: null, error: "Please enter a valid email address" };
  }

  const result = await auth.resetPassword(parsed.data.email);

  if (!result.success) {
    return { success: false, data: null, error: result.error?.message || "Failed to send reset email" };
  }

  return { success: true, data: { message: "If an account with that email exists, a password reset link has been sent." } };
}

export async function resetPasswordAction(data: Record<string, unknown>): Promise<ActionResult<{ message: string }>> {
  const parsed = ResetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, data: null, error: parsed.error.issues[0]?.message || "Invalid password" };
  }

  const result = await auth.updatePassword(parsed.data.password);

  if (!result.success) {
    return { success: false, data: null, error: result.error?.message || "Failed to reset password" };
  }

  return { success: true, data: { message: "Password reset successfully" } };
}
