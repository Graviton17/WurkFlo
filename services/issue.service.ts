import { IssueCURD } from "@/curd/index";
import { Issue, IssueWithRelations, DatabaseResponse } from "@/types/index";

export class IssueService {
  private issueCurd: IssueCURD;

  constructor() {
    this.issueCurd = new IssueCURD();
  }

  // ── Basic CRUD ──

  async getIssuesByProject(
    projectId: string,
  ): Promise<DatabaseResponse<Issue[]>> {
    return this.issueCurd.getAll({ filters: { project_id: projectId } });
  }

  async getIssueById(id: string): Promise<DatabaseResponse<Issue>> {
    return this.issueCurd.getById(id);
  }

  async createIssue(data: Partial<Issue>): Promise<DatabaseResponse<Issue>> {
    return this.issueCurd.create(data);
  }

  async updateIssue(
    id: string,
    data: Partial<Issue>,
  ): Promise<DatabaseResponse<Issue>> {
    return this.issueCurd.update(id, data);
  }

  async deleteIssue(id: string): Promise<DatabaseResponse<null>> {
    return this.issueCurd.delete(id);
  }

  // ── Enriched Queries ──

  /**
   * Get all issues for a project with resolved relations (assignee, state, sprint, etc.).
   */
  async getIssuesWithRelations(
    projectId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.issueCurd.getByProjectWithRelations(projectId);
  }

  /**
   * Get issues for the active sprint (Kanban board data).
   */
  async getSprintIssues(
    sprintId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.issueCurd.getBySprintId(sprintId);
  }

  /**
   * Get backlog issues (no sprint assigned).
   */
  async getBacklog(
    projectId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.issueCurd.getBacklogByProject(projectId);
  }

  /**
   * Get issues assigned to a user in a workspace (My Issues / Inbox).
   * Excludes issues in "done" workflow state category.
   */
  async getMyIssues(
    userId: string,
    workspaceId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.issueCurd.getByAssignee(userId, workspaceId);
  }

  /**
   * Get a single issue with all resolved relations (detail modal).
   */
  async getIssueDetail(
    id: string,
  ): Promise<DatabaseResponse<IssueWithRelations>> {
    return this.issueCurd.getByIdWithRelations(id);
  }

  /**
   * Search issues by title within a workspace (command palette).
   */
  async searchIssues(
    query: string,
    workspaceId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.issueCurd.searchByTitle(query, workspaceId);
  }

  /**
   * Get issues linked to a specific epic.
   */
  async getIssuesByEpic(
    epicId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.issueCurd.getByEpicId(epicId);
  }

  /**
   * Get issues linked to a specific release.
   */
  async getIssuesByRelease(
    releaseId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return this.issueCurd.getByReleaseId(releaseId);
  }

  /**
   * Get the next sequence_id for a project.
   */
  async getNextSequenceId(projectId: string): Promise<number> {
    return this.issueCurd.getNextSequenceId(projectId);
  }
}

export const issueService = new IssueService();
