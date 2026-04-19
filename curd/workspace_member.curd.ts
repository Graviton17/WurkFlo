import { BaseCURD } from "./base_curd.curd";
import { WorkspaceMember } from "@/types/index";

export class WorkspaceMemberCURD extends BaseCURD<WorkspaceMember> {
  constructor() {
    super("workspace_members");
  }

  async getAllWorkspacesByUserId(userId: string) {
    const db = await this.getClient();
    const { data, error } = await db
      .from(this.tableName)
      .select(`
        role,
        workspaces!inner (
          *
        )
      `)
      .eq("user_id", userId);

    if (error || !data) {
      return { 
        data: null, 
        error, 
        success: false 
      };
    }

    // Map to match the expected WorkspaceWithRole format
    const formattedData = data.map((item: any) => ({
      ...(Array.isArray(item.workspaces) ? item.workspaces[0] : item.workspaces),
      role: item.role,
    }));

    return { 
      data: formattedData, 
      error: null, 
      success: true 
    };
  }

  /**
   * Delete all members for a given workspace
   */
  async deleteAllByWorkspaceId(workspaceId: string) {
    const db = await this.getClient();
    const { error } = await db
      .from(this.tableName)
      .delete()
      .eq("workspace_id", workspaceId);

    return { data: null, error, success: !error };
  }

  // Override standard BaseCURD by extending with composite ID capability if needed
  async deleteByCompositeKey(workspaceId: string, userId: string) {
    const db = await this.getClient();
    const { error } = await db
      .from(this.tableName)
      .delete()
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId);
      
    return { data: null, error, success: !error };
  }

  async updateRoleByCompositeKey(workspaceId: string, userId: string, role: string) {
    const db = await this.getClient();
    const { data, error } = await db
      .from(this.tableName)
      .update({ role })
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .select()
      .single();
      
    return { data, error, success: !error };
  }

  async getMembersWithProfiles(workspaceId: string) {
    const db = await this.getClient();
    const { data, error } = await db
      .from(this.tableName)
      .select(`
        *,
        users (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq("workspace_id", workspaceId);

    if (error || !data) {
      return { data: null, error, success: false };
    }

    const formattedData = data.map((item: any) => ({
      ...item,
      user: Array.isArray(item.users) ? item.users[0] : item.users
    }));

    return { data: formattedData, error: null, success: true };
  }

}
