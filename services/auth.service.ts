import { supabase } from "./supabase";
import { User, Session } from "@supabase/supabase-js";
import type {
  AuthResponse,
  SignUpCredentials,
  SignInCredentials,
} from "@/types/index";

/**
 * Authentication Service
 * Handles all authentication-related operations
 */
export class AuthService {
  /**
   * Sign up a new user
   * @param credentials - User credentials
   * @returns Promise with user data or error
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: credentials.metadata,
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
        },
      });

      return {
        data: data.user,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Sign in an existing user
   * @param credentials - User credentials
   * @returns Promise with session data or error
   */
  async signIn(credentials: SignInCredentials): Promise<AuthResponse<Session>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      return {
        data: data.session,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Sign in with OAuth provider
   * @param provider - OAuth provider name
   * @returns Promise with response or error
   */
  async signInWithOAuth(provider: "google" | "github" | "gitlab" | "facebook") {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
        },
      });

      return {
        data,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Sign out the current user
   * @returns Promise with success status
   */
  async signOut(): Promise<AuthResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();

      return {
        data: null,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Get the current user
   * @returns Promise with user data or error
   */
  async getCurrentUser(): Promise<AuthResponse<User>> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      return {
        data: user,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Get the current session
   * @returns Promise with session data or error
   */
  async getSession(): Promise<AuthResponse<Session>> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      return {
        data: session,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Reset password for a user
   * @param email - User email
   * @returns Promise with success status
   */
  async resetPassword(email: string): Promise<AuthResponse<null>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      return {
        data: null,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Update user password
   * @param newPassword - New password
   * @returns Promise with user data or error
   */
  async updatePassword(newPassword: string): Promise<AuthResponse<User>> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      return {
        data: data.user,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Update user metadata
   * @param metadata - User metadata
   * @returns Promise with user data or error
   */
  async updateUserMetadata(
    metadata: Record<string, any>,
  ): Promise<AuthResponse<User>> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata,
      });

      return {
        data: data.user,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Listen to auth state changes
   * @param callback - Callback function
   * @returns Unsubscribe function
   */
  onAuthStateChange(
    callback: (event: string, session: Session | null) => void,
  ) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);

    return () => subscription.unsubscribe();
  }
}

/**
 * Export singleton instance
 */
export const authService = new AuthService();
