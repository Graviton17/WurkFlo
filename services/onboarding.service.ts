import { UserCURD, WorkspaceMemberCURD } from "@/curd/index";
import { AtomicCreateWorkspaceWithProjectParams } from "@/types/index";
import { RPCService, rpcService } from "./rpc.service";
import { logger } from "@/lib/logger";

export class OnboardingService {
  private userCurd: UserCURD;
  private workspaceMemberCurd: WorkspaceMemberCURD;
  private rpcService: RPCService;

  constructor() {
    this.userCurd = new UserCURD();
    this.workspaceMemberCurd = new WorkspaceMemberCURD();
    this.rpcService = new RPCService()
  }

  async getMemberWorkspace(userId: string) {
    const { data, error } =
      await this.workspaceMemberCurd.getWorkspaceByUserId(userId);
    return { data, error };
  }

  async getUserProfile(userId: string) {
    return await this.userCurd.getById(userId, "id, full_name");
  }

  async createWorkspaceAndProject(
    workspaceData: { name: string; slug: string },
    projectData: { name: string; identifier: string; description?: string },
    userId: string,
  ) {
    if (!projectData) {
      throw new Error("Project data is required to initialize a workspace.");
    }

    const params: AtomicCreateWorkspaceWithProjectParams = {
      workspace_name: workspaceData.name,
      workspace_identifier: workspaceData.slug,
      workspace_description: "",
      project_name: projectData.name,
      project_identifier: projectData.identifier,
      project_description: projectData.description || "",
      owner_id: userId,
    };

    return await this.rpcService.atomicCreateWorkspaceWithProject(params);
  }

  async addMembers(
    workspaceId: string,
    membersData: Array<{ email: string; role: string }>,
  ) {
    if (!membersData || membersData.length === 0) return { success: true };

    const emails = membersData.map((m) => m.email);
    const { data: usersList } = await this.userCurd.getByEmails(emails, "id, email");
    const allUsers = usersList || [];

    const membersToInsert = membersData
      .map((m: any) => {
        const match = allUsers.find(
          (u: any) => u.email.toLowerCase() === m.email.toLowerCase(),
        );
        if (match) {
          return {
            workspace_id: workspaceId,
            user_id: match.id,
            role: m.role,
          };
        }
        return null;
      })
      .filter(Boolean) as any[];

    if (membersToInsert.length > 0) {
      const { error, success } =
        await this.workspaceMemberCurd.createMany(membersToInsert);
      if (!success) {
        logger.error({ err: error }, "Failed to add some members:");
        return { success: false, error };
      }
    }

    return { success: true };
  }
}

export const onboardingService = new OnboardingService();
