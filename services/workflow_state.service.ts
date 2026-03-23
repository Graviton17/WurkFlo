import { WorkflowStateCURD } from "@/curd/index";
import { WorkflowState, DatabaseResponse } from "@/types/index";
import { supabase } from "./supabase";

export class WorkflowStateService {
  private workflowStateCurd: WorkflowStateCURD;

  constructor() {
    this.workflowStateCurd = new WorkflowStateCURD();
  }

  async getStatesByProject(projectId: string): Promise<DatabaseResponse<WorkflowState[]>> {
    return this.workflowStateCurd.getAll({ 
      filters: { project_id: projectId },
      orderBy: { column: "position", ascending: true }
    });
  }

  async getStateById(id: string): Promise<DatabaseResponse<WorkflowState>> {
    return this.workflowStateCurd.getById(id);
  }

  async createState(data: Partial<WorkflowState>): Promise<DatabaseResponse<WorkflowState>> {
    return this.workflowStateCurd.create(data);
  }

  async updateState(id: string, data: Partial<WorkflowState>): Promise<DatabaseResponse<WorkflowState>> {
    return this.workflowStateCurd.update(id, data);
  }

  async deleteState(id: string): Promise<DatabaseResponse<null>> {
    return this.workflowStateCurd.delete(id);
  }
}

export const workflowStateService = new WorkflowStateService();
