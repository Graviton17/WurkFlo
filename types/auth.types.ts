import { AuthError } from "@supabase/supabase-js";

/**
 * Authentication response type
 */
export interface AuthResponse<T = any> {
  data: T | null;
  error: AuthError | Error | null;
  success: boolean;
}

/**
 * Sign up credentials
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  metadata?: Record<string, any>;
}

/**
 * Sign in credentials
 */
export interface SignInCredentials {
  email: string;
  password: string;
}
