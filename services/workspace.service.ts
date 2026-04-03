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

  async getAllWorkspaces(): Promise<DatabaseResponse<Workspace[]>> {
    return this.workspaceCurd.getAll();
  }

  async getWorkspaceById(id: string): Promise<DatabaseResponse<Workspace>> {
    return this.workspaceCurd.getById(id);
  }

  async createWorkspace(data: Partial<Workspace>): Promise<DatabaseResponse<Workspace>> {
    return this.workspaceCurd.create(data);
  }

  async updateWorkspace(id: string, data: Partial<Workspace>): Promise<DatabaseResponse<Workspace>> {
    return this.workspaceCurd.update(id, data);
  }

  async deleteWorkspace(id: string): Promise<DatabaseResponse<null>> {
    return this.workspaceCurd.delete(id);
  }

  async getWorkspaceMembershipByUserId(userId: string) {
    return this.memberCurd.getWorkspaceByUserId(userId);
  }

  async getAllWorkspacesByUserId(userId: string) {
    return this.memberCurd.getAllWorkspacesByUserId(userId);
  }

  // --- Workspace Member Operations ---

  async getWorkspaceMembers(workspaceId: string): Promise<DatabaseResponse<WorkspaceMember[]>> {
    return this.memberCurd.getAll({ filters: { workspace_id: workspaceId } });
  }

  async addMember(workspaceId: string, userId: string, role: WorkspaceRole = "member"): Promise<DatabaseResponse<WorkspaceMember>> {
    return this.memberCurd.create({ workspace_id: workspaceId, user_id: userId, role });
  }

  async updateMemberRole(workspaceId: string, userId: string, newRole: WorkspaceRole): Promise<DatabaseResponse<WorkspaceMember>> {
    return this.memberCurd.updateByCompositeKey(workspaceId, userId, { role: newRole });
  }

  async removeMember(workspaceId: string, userId: string): Promise<DatabaseResponse<null>> {
    return this.memberCurd.deleteByCompositeKey(workspaceId, userId);
  }
}

export const workspaceService = new WorkspaceService();
