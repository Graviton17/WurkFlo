import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AtomicCreateWorkspaceWithProjectParams } from "@/types/index";

export class RPCService {
  /**
   * Executes the atomic_create_workspace_with_project RPC function
   */
  async atomicCreateWorkspaceWithProject(
    params: AtomicCreateWorkspaceWithProjectParams,
  ) {
    const supabase = await createServerSupabaseClient();

    return await supabase.rpc("atomic_create_workspace_with_project", params);
  }
}

export const rpcService = new RPCService();
