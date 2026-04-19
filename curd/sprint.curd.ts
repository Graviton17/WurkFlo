import { BaseCURD } from "./base_curd.curd";
import type { Sprint } from "@/types/model/sprint.types";
import type { DatabaseResponse } from "@/types/index";

export class SprintCURD extends BaseCURD<Sprint> {
  constructor() {
    super("sprints");
  }

  /**
   * Get the currently active sprint for a project.
   */
  async getActiveSprint(
    projectId: string,
  ): Promise<DatabaseResponse<Sprint>> {
    try {
      const db = await this.getClient();
      const { data, error } = await db
        .from(this.tableName)
        .select("*")
        .eq("project_id", projectId)
        .eq("status", "active")
        .maybeSingle();

      return {
        data: data as Sprint | null,
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
   * Check whether a project has any sprint with status = 'active'.
   */
  async hasActiveSprint(projectId: string): Promise<boolean> {
    try {
      const db = await this.getClient();
      const { data, error } = await db
        .from(this.tableName)
        .select("id")
        .eq("project_id", projectId)
        .eq("status", "active")
        .maybeSingle();

      return !error && data !== null;
    } catch {
      return false;
    }
  }
}
