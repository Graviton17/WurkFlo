import { userService } from "./user.service";
import { User as AuthUser } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

export class AuthSyncService {
  /**
   * Sync Supabase auth user with public.users table.
   * Handles profile details like email, full_name, and avatar_url.
   */
  async syncUser(authUser: AuthUser) {
    try {
      const email = authUser.email;
      if (!email)
        return { success: false, error: "No email provided by auth user." };

      const id = authUser.id;
      const full_name =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        null;
      const avatar_url =
        authUser.user_metadata?.avatar_url ||
        authUser.user_metadata?.picture ||
        null;

      const payload = {
        id,
        email,
        full_name,
        avatar_url,
      };

      const result = await userService.upsertUser(payload);

      if (!result.success) {
        logger.error(
          { error: result.error },
          "Failed to sync auth user to public.users",
        );
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (error) {
      logger.error({ error }, "Unexpected error syncing user");
      return { success: false, error };
    }
  }
}

export const authSyncService = new AuthSyncService();
