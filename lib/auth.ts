
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { User, Session } from "@supabase/supabase-js";
import type {
  AuthResponse,
  SignUpCredentials,
  SignInCredentials,
} from "@/types/index";

/**
 * Authentication Service
 * Handles all authentication-related operations.
 * Uses getClient() to resolve correct Supabase client for server vs browser context.
 */
export class Auth {
  /**
   * Get the Supabase server client for the current request.
   * Always creates a fresh instance to ensure correct cookie context.
   */
  private async getClient() {
    return await createServerSupabaseClient();
  }

  /**
   * Sign up a new user
   * @param credentials - User credentials
   * @returns Promise with user data or error
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse<User>> {
    try {
      const client = await this.getClient();
      const { data, error } = await client.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: credentials.metadata,
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`,
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
      const client = await this.getClient();
      const { data, error } = await client.auth.signInWithPassword({
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
      const client = await this.getClient();
      const { data, error } = await client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`,
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
      const client = await this.getClient();
      const { error } = await client.auth.signOut();

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
      const client = await this.getClient();
      const {
        data: { user },
        error,
      } = await client.auth.getUser();

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
   * Get the authenticated user directly.
   * Returns User | null without the AuthResponse wrapper.
   * Ideal for quick auth guards (e.g. API wrapper).
   */
  async getUser(): Promise<User | null> {
    try {
      const client = await this.getClient();
      const { data: { user }, error } = await client.auth.getUser();
      if (error || !user) return null;
      return user;
    } catch {
      return null;
    }
  }

  /**
   * Get the current session
   * @returns Promise with session data or error
   */
  async getSession(): Promise<AuthResponse<Session>> {
    try {
      const client = await this.getClient();
      const {
        data: { session },
        error,
      } = await client.auth.getSession();

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
      const client = await this.getClient();
      const { error } = await client.auth.resetPasswordForEmail(email);

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
      const client = await this.getClient();
      const { data, error } = await client.auth.updateUser({
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
      const client = await this.getClient();
      const { data, error } = await client.auth.updateUser({
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
   * Send a magic link to the user's email for passwordless login
   * @param email - User email
   * @returns Promise with success status
   */
  async signInWithOtp(email: string): Promise<AuthResponse<null>> {
    try {
      const client = await this.getClient();
      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`,
        },
      });

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
   * Handle OAuth Callback
   * @param code - Authorization code
   * @param next - Redirect path
   * @returns Redirect path
   */
  async handleOAuthCallback(code: string, next: string | null): Promise<string> {
    const client = await this.getClient();
    const { error, data: sessionData } = await client.auth.exchangeCodeForSession(code);

    if (!error && sessionData?.user) {
      // ── Sync auth user → public.users (non-blocking) ──
      try {
        const { authSyncService } = await import("@/services");
        const syncResult = await authSyncService.syncUser(sessionData.user);
        if (!syncResult.success) {
          const { logger } = await import("@/lib/logger");
          logger.error({ error: syncResult.error }, "OAuth syncUser failed");
        }
      } catch (syncErr) {
        const { logger } = await import("@/lib/logger");
        logger.error({ err: syncErr }, "OAuth syncUser threw");
      }

      let redirectPath = next;
      
      if (!redirectPath) {
        // Check workspace membership to decide redirect
        const { workspaceService } = await import("@/services");
        const workspaces = await workspaceService.getAllWorkspacesByUserId(sessionData.user.id);
        redirectPath = (workspaces.data && workspaces.data.length > 0) ? "/dashboard/workspace" : "/onboarding";
      }
      
      return redirectPath;
    } else {
      const { logger } = await import("@/lib/logger");
      logger.error({ err: error }, "OAuth callback error:");
      return "/login?error=auth_callback_failed";
    }
  }
}

/**
 * Export singleton instance
 */
export const auth = new Auth();
