import { UserCURD, WorkspaceMemberCURD, ProjectCURD } from "@/curd/index";
import { createServerComponentClient } from "./server.service";

export class OnboardingService {
  private userCurd: UserCURD;
  private workspaceMemberCurd: WorkspaceMemberCURD;

  constructor() {
    this.userCurd = new UserCURD();
    this.workspaceMemberCurd = new WorkspaceMemberCURD();
  }

  async getMemberWorkspace(userId: string) {
    const { data, error } = await this.workspaceMemberCurd.getAll({
      filters: { user_id: userId },
      limit: 1,
      select: "workspace_id",
    });

    // Mimic the .maybeSingle() behavior
    if (data && data.length > 0) {
      return { data: data[0], error };
    }
    return { data: null, error };
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

    const supabase = await createServerComponentClient();

    return await supabase.rpc("atomic_create_workspace_with_project", {
      workspace_name: workspaceData.name,
      workspace_identifier: workspaceData.slug,
      workspace_description: "",
      project_name: projectData.name,
      project_identifier: projectData.identifier,
      project_description: projectData.description || "",
      owner_id: userId,
    });
  }

  async addMembers(
    workspaceId: string,
    membersData: Array<{ email: string; role: string }>,
  ) {
    if (!membersData || membersData.length === 0) return { success: true };

    const { data: usersList } = await this.userCurd.getAll({
      select: "id, email",
    });
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
        console.error("Failed to add some members:", error);
        return { success: false, error };
      }
    }

    return { success: true };
  }
}

export const onboardingService = new OnboardingService();
