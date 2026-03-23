import { ProjectCURD } from "@/curd/index";
import { Project, DatabaseResponse } from "@/types/index";

export class ProjectService {
  private projectCurd: ProjectCURD;

  constructor() {
    this.projectCurd = new ProjectCURD();
  }

  async getProjectsByWorkspace(workspaceId: string): Promise<DatabaseResponse<Project[]>> {
    return this.projectCurd.getAll({ filters: { workspace_id: workspaceId } });
  }

  async getProjectById(id: string): Promise<DatabaseResponse<Project>> {
    return this.projectCurd.getById(id);
  }

  async createProject(data: Partial<Project>): Promise<DatabaseResponse<Project>> {
    return this.projectCurd.create(data);
  }

  async updateProject(id: string, data: Partial<Project>): Promise<DatabaseResponse<Project>> {
    return this.projectCurd.update(id, data);
  }

  async deleteProject(id: string): Promise<DatabaseResponse<null>> {
    return this.projectCurd.delete(id);
  }
}

export const projectService = new ProjectService();
