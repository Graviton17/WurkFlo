import { BaseCURD } from "./base_curd.curd";
import { WorkspaceMember } from "@/types/index";
import { supabase } from "@/services/supabase";

export class WorkspaceMemberCURD extends BaseCURD<WorkspaceMember> {
  constructor() {
    super("workspace_members");
  }

  // Override standard BaseCURD by extending with composite ID capability if needed
  async deleteByCompositeKey(workspaceId: string, userId: string) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId);
      
    return { data: null, error, success: !error };
  }

  async getByCompositeKey(workspaceId: string, userId: string) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .single();
      
    return { data: data as WorkspaceMember | null, error, success: !error };
  }

  async updateByCompositeKey(workspaceId: string, userId: string, data: Partial<WorkspaceMember>) {
    const { data: updatedData, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .select()
      .single();
      
    return { data: updatedData as WorkspaceMember | null, error, success: !error };
  }
}
