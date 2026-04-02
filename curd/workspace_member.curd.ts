import { BaseCURD } from "./base_curd.curd";
import { WorkspaceMember } from "@/types/index";

export class WorkspaceMemberCURD extends BaseCURD<WorkspaceMember> {
  constructor() {
    super("workspace_members");
  }

  async getWorkspaceByUserId(userId: string) {
    const db = await this.getClient();
    const { data, error } = await db
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    return { 
      data: data as WorkspaceMember | null, 
      error, 
      success: !error 
    };
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

  async getByCompositeKey(workspaceId: string, userId: string) {
    const db = await this.getClient();
    const { data, error } = await db
      .from(this.tableName)
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .single();
      
    return { data: data as WorkspaceMember | null, error, success: !error };
  }

  async updateByCompositeKey(workspaceId: string, userId: string, data: Partial<WorkspaceMember>) {
    const db = await this.getClient();
    const { data: updatedData, error } = await db
      .from(this.tableName)
      .update(data)
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .select()
      .single();
      
    return { data: updatedData as WorkspaceMember | null, error, success: !error };
  }
}
