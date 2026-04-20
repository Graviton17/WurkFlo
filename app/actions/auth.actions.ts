"use server";

import { auth } from "@/lib/auth";
import { authSyncService } from "@/services";
import { LoginSchema, CreateUserSchema } from "@/types/validation";
import type { ActionResult } from "@/types/index";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { z } from "zod";

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

const EmailSchema = z.object({ email: z.string().email("Valid email is required") });

/**
 * Send a magic link email for passwordless login
 */
export async function sendMagicLinkAction(data: Record<string, unknown>): Promise<ActionResult<{ message: string }>> {
  const parsed = EmailSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, data: null, error: "Please enter a valid email address" };
  }

  const result = await auth.signInWithOtp(parsed.data.email);

  if (!result.success) {
    return { success: false, data: null, error: result.error?.message || "Failed to send login link" };
  }

  return { success: true, data: { message: "Login link sent to your email" } };
}
