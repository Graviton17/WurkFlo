import { WorkspaceCURD, WorkspaceMemberCURD } from "@/curd/index";
import { Workspace, WorkspaceMember, DatabaseResponse, WorkspaceRole } from "@/types/index";

export class WorkspaceService {
  private workspaceCurd: WorkspaceCURD;
  private memberCurd: WorkspaceMemberCURD;

  constructor() {
    this.workspaceCurd = new WorkspaceCURD();
    this.memberCurd = new WorkspaceMemberCURD();
  }

  // --- Workspace Operations ---

  /**
   * Create a workspace and auto-add the creator as an "admin" member.
   * Rolls back (deletes the workspace) if member creation fails.
   */
  async createWorkspace(data: Partial<Workspace>, userId: string): Promise<DatabaseResponse<Workspace>> {
    // 1. Create the workspace row
    const workspaceResult = await this.workspaceCurd.create(data);

    if (!workspaceResult.success || !workspaceResult.data) {
      return workspaceResult;
    }

    // 2. Add creator as admin member
    const memberResult = await this.memberCurd.create({
      workspace_id: workspaceResult.data.id,
      user_id: userId,
      role: "admin",
    });

    if (!memberResult.success) {
      // Rollback: delete the orphaned workspace
      await this.workspaceCurd.delete(workspaceResult.data.id);
      return {
        data: null,
        error: memberResult.error,
        success: false,
      };
    }

    return workspaceResult;
  }

  /**
   * Delete a workspace: first remove all members, then delete the workspace itself.
   */
  async deleteWorkspace(id: string): Promise<DatabaseResponse<null>> {
    // 1. Delete all members for this workspace
    const memberDeleteResult = await this.memberCurd.deleteAllByWorkspaceId(id);

    if (!memberDeleteResult.success) {
      return {
        data: null,
        error: memberDeleteResult.error,
        success: false,
      };
    }

    // 2. Delete the workspace row
    return this.workspaceCurd.delete(id);
  }

  /**
   * Get workspace detail by its ID.
   */
  async getWorkspaceById(id: string): Promise<DatabaseResponse<Workspace>> {
    return this.workspaceCurd.getById(id);
  }

  /**
   * Update workspace details.
   */
  async updateWorkspace(id: string, data: Partial<Workspace>): Promise<DatabaseResponse<Workspace>> {
    return this.workspaceCurd.update(id, data);
  }

  /**
   * Get all workspaces a user belongs to (with their role).
   */
  async getAllWorkspacesByUserId(userId: string) {
    return this.memberCurd.getAllWorkspacesByUserId(userId);
  }

  // --- Workspace Member Operations ---

  /**
   * Get all members for a particular workspace.
   */
  async getWorkspaceMembers(workspaceId: string): Promise<DatabaseResponse<WorkspaceMember[]>> {
    return this.memberCurd.getAll({ filters: { workspace_id: workspaceId } });
  }

  /**
   * Add a member to a workspace with the given role.
   */
  async addMember(workspaceId: string, userId: string, role: WorkspaceRole = "member"): Promise<DatabaseResponse<WorkspaceMember>> {
    return this.memberCurd.create({ workspace_id: workspaceId, user_id: userId, role });
  }

  /**
   * Remove a member from a workspace.
   */
  async removeMember(workspaceId: string, userId: string): Promise<DatabaseResponse<null>> {
    return this.memberCurd.deleteByCompositeKey(workspaceId, userId);
  }

  /**
   * Get all members with joined profiles
   */
  async getWorkspaceMembersWithProfiles(workspaceId: string) {
    return this.memberCurd.getMembersWithProfiles(workspaceId);
  }

  /**
   * Update member role
   */
  async updateMemberRole(workspaceId: string, userId: string, role: string) {
    return this.memberCurd.updateRoleByCompositeKey(workspaceId, userId, role);
  }
}

export const workspaceService = new WorkspaceService();
