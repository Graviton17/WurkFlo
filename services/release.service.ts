import { ReleaseCURD } from "@/curd/index";
import { Release, DatabaseResponse } from "@/types/index";

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
}

export const releaseService = new ReleaseService();
