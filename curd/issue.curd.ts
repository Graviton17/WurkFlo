import { BaseCURD } from "./base_curd.curd";
import type { Issue, IssueWithRelations } from "@/types/index";
import type { DatabaseResponse } from "@/types/index";

// Supabase select string that JOINs all related tables
const ISSUE_WITH_RELATIONS_SELECT = `
  *,
  assignee:users!issues_assignee_id_fkey ( id, full_name, avatar_url ),
  workflow_state:workflow_states!issues_state_id_fkey ( id, name, category ),
  sprint:sprints!issues_sprint_id_fkey ( id, name ),
  epic:epics!issues_epic_id_fkey ( id, name ),
  release:releases!issues_release_id_fkey ( id, version )
`;

export class IssueCURD extends BaseCURD<Issue> {
  constructor() {
    super("issues");
  }

  /**
   * Get all issues for a project with fully resolved relations.
   */
  async getByProjectWithRelations(
    projectId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.customQuery<IssueWithRelations[]>((table) =>
      table
        .select(ISSUE_WITH_RELATIONS_SELECT)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false }),
    );
  }

  /**
   * Get issues for a specific sprint (Kanban board).
   */
  async getBySprintId(
    sprintId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.customQuery<IssueWithRelations[]>((table) =>
      table
        .select(ISSUE_WITH_RELATIONS_SELECT)
        .eq("sprint_id", sprintId)
        .order("created_at", { ascending: false }),
    );
  }

  /**
   * Get backlog issues: sprint_id IS NULL.
   */
  async getBacklogByProject(
    projectId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.customQuery<IssueWithRelations[]>((table) =>
      table
        .select(ISSUE_WITH_RELATIONS_SELECT)
        .eq("project_id", projectId)
        .is("sprint_id", null)
        .order("created_at", { ascending: false }),
    );
  }

  /**
   * Get issues assigned to a user within a workspace, excluding "done" states.
   * Uses a left join on workflow_states and filters by category != 'done'.
   */
  async getByAssignee(
    userId: string,
    workspaceId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.customQuery<IssueWithRelations[]>((table) =>
      table
        .select(ISSUE_WITH_RELATIONS_SELECT)
        .eq("assignee_id", userId)
        .eq("workspace_id", workspaceId)
        .not("workflow_state.category", "eq", "done")
        .order("updated_at", { ascending: false }),
    );
  }

  /**
   * Get a single issue with all relations resolved (for detail modal).
   */
  async getByIdWithRelations(
    id: string,
  ): Promise<DatabaseResponse<IssueWithRelations>> {
    try {
      const db = await this.getClient();
      const { data, error } = await db
        .from(this.tableName)
        .select(ISSUE_WITH_RELATIONS_SELECT)
        .eq("id", id)
        .maybeSingle();

      return {
        data: data as IssueWithRelations | null,
        error,
        success: !error,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
        success: false,
      };
    }
  }

  /**
   * Get issues linked to a specific epic.
   */
  async getByEpicId(
    epicId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.customQuery<IssueWithRelations[]>((table) =>
      table
        .select(ISSUE_WITH_RELATIONS_SELECT)
        .eq("epic_id", epicId)
        .order("created_at", { ascending: false }),
    );
  }

  /**
   * Get issues linked to a specific release (changelog).
   */
  async getByReleaseId(
    releaseId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.customQuery<IssueWithRelations[]>((table) =>
      table
        .select(ISSUE_WITH_RELATIONS_SELECT)
        .eq("release_id", releaseId)
        .order("created_at", { ascending: false }),
    );
  }

  /**
   * Search issues by title (ilike) scoped to a workspace.
   */
  async searchByTitle(
    query: string,
    workspaceId: string,
    limit: number = 10,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.customQuery<IssueWithRelations[]>((table) =>
      table
        .select(ISSUE_WITH_RELATIONS_SELECT)
        .eq("workspace_id", workspaceId)
        .ilike("title", `%${query}%`)
        .limit(limit)
        .order("updated_at", { ascending: false }),
    );
  }

  /**
   * Get the next sequence_id for a project using the Supabase RPC function.
   * Falls back to a MAX query if RPC is unavailable.
   */
  async getNextSequenceId(projectId: string): Promise<number> {
    try {
      const db = await this.getClient();

      // Use the atomic RPC function
      const { data, error } = await db.rpc("next_issue_sequence_id", {
        p_project_id: projectId,
      });

      if (!error && typeof data === "number") {
        return data;
      }

      // Fallback: MAX query (non-atomic, but works if RPC not deployed yet)
      const { data: fallback } = await db
        .from(this.tableName)
        .select("sequence_id")
        .eq("project_id", projectId)
        .order("sequence_id", { ascending: false })
        .limit(1)
        .maybeSingle();

      return (fallback?.sequence_id ?? 0) + 1;
    } catch {
      return 1;
    }
  }
}
