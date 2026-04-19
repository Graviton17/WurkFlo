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

  /**
   * Get all members for a workspace with their user profile info (name, avatar, email).
   */
  async getMembersWithUserInfo(workspaceId: string) {
    try {
      const db = await this.getClient();
      const { data, error } = await db
        .from(this.tableName)
        .select(`
          user_id,
          role,
          created_at,
          users!inner (
            id,
            full_name,
            avatar_url,
            email
          )
        `)
        .eq("workspace_id", workspaceId);

      if (error || !data) {
        return { data: null, error, success: false };
      }

      // Flatten the result to a simpler format
      const members = data.map((item: any) => {
        const user = Array.isArray(item.users) ? item.users[0] : item.users;
        return {
          user_id: item.user_id,
          role: item.role,
          full_name: user?.full_name || null,
          avatar_url: user?.avatar_url || null,
          email: user?.email || null,
        };
      });

      return { data: members, error: null, success: true };
    } catch (error) {
      return { data: null, error: error as Error, success: false };
    }
  }

}
