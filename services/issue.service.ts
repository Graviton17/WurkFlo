import { IssueCURD } from "@/curd/index";
import { Issue, DatabaseResponse } from "@/types/index";

export class IssueService {
  private issueCurd: IssueCURD;

  constructor() {
    this.issueCurd = new IssueCURD();
  }

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
}

export const issueService = new IssueService();
