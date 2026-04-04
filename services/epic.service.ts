import { EpicCURD } from "@/curd/index";
import { Epic, DatabaseResponse } from "@/types/index";

export class EpicService {
  private epicCurd: EpicCURD;

  constructor() {
    this.epicCurd = new EpicCURD();
  }

  async getEpicsByProject(
    projectId: string,
  ): Promise<DatabaseResponse<Epic[]>> {
    return this.epicCurd.getAll({ filters: { project_id: projectId } });
  }

  async getEpicById(id: string): Promise<DatabaseResponse<Epic>> {
    return this.epicCurd.getById(id);
  }

  async createEpic(data: Partial<Epic>): Promise<DatabaseResponse<Epic>> {
    return this.epicCurd.create(data);
  }

  async updateEpic(
    id: string,
    data: Partial<Epic>,
  ): Promise<DatabaseResponse<Epic>> {
    return this.epicCurd.update(id, data);
  }

  async deleteEpic(id: string): Promise<DatabaseResponse<null>> {
    return this.epicCurd.delete(id);
  }
}

export const epicService = new EpicService();
