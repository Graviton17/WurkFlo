import { ReleaseCURD } from "@/curd/index";
import { Release, ReleaseWithProgress, DatabaseResponse } from "@/types/index";
import { issueService } from "./issue.service";
import type { IssueWithRelations } from "@/types/index";

export class ReleaseService {
  private releaseCurd: ReleaseCURD;

  constructor() {
    this.releaseCurd = new ReleaseCURD();
  }

  async getReleasesByProject(
    projectId: string,
  ): Promise<DatabaseResponse<Release[]>> {
    return this.releaseCurd.getAll({ filters: { project_id: projectId } });
  }

  async getReleaseById(id: string): Promise<DatabaseResponse<Release>> {
    return this.releaseCurd.getById(id);
  }

  async createRelease(
    data: Partial<Release>,
  ): Promise<DatabaseResponse<Release>> {
    return this.releaseCurd.create(data);
  }

  async updateRelease(
    id: string,
    data: Partial<Release>,
  ): Promise<DatabaseResponse<Release>> {
    return this.releaseCurd.update(id, data);
  }

  async deleteRelease(id: string): Promise<DatabaseResponse<null>> {
    return this.releaseCurd.delete(id);
  }

  /**
   * Get changelog for a release (all issues linked to it).
   */
  async getReleaseChangelog(
    releaseId: string,
  ): Promise<DatabaseResponse<IssueWithRelations[]>> {
    return issueService.getIssuesByRelease(releaseId);
  }

  /**
   * Get releases with aggregated issue progress counts.
   */
  async getReleasesWithProgress(
    projectId: string,
  ): Promise<DatabaseResponse<ReleaseWithProgress[]>> {
    return this.releaseCurd.getByProjectWithIssueCounts(projectId);
  }
}

export const releaseService = new ReleaseService();
