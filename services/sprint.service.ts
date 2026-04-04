import { SprintCURD } from "@/curd/index";
import { Sprint, DatabaseResponse } from "@/types/index";

export class SprintService {
  private sprintCurd: SprintCURD;

  constructor() {
    this.sprintCurd = new SprintCURD();
  }

  async getSprintsByProject(
    projectId: string,
  ): Promise<DatabaseResponse<Sprint[]>> {
    return this.sprintCurd.getAll({ filters: { project_id: projectId } });
  }

  async getSprintById(id: string): Promise<DatabaseResponse<Sprint>> {
    return this.sprintCurd.getById(id);
  }

  async createSprint(data: Partial<Sprint>): Promise<DatabaseResponse<Sprint>> {
    return this.sprintCurd.create(data);
  }

  async updateSprint(
    id: string,
    data: Partial<Sprint>,
  ): Promise<DatabaseResponse<Sprint>> {
    return this.sprintCurd.update(id, data);
  }

  async deleteSprint(id: string): Promise<DatabaseResponse<null>> {
    return this.sprintCurd.delete(id);
  }
}

export const sprintService = new SprintService();
