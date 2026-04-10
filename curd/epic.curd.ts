import { BaseCURD } from "./base_curd.curd";
import type { Epic } from "@/types/model/epic.types";
import type { EpicWithProgress } from "@/types/index";
import type { DatabaseResponse } from "@/types/index";

export class EpicCURD extends BaseCURD<Epic> {
  constructor() {
    super("epics");
  }

  /**
   * Get all epics for a project with aggregate issue progress.
   * Returns total_issues and done_issues counts for each epic.
   */
  async getByProjectWithProgress(
    projectId: string,
  ): Promise<DatabaseResponse<EpicWithProgress[]>> {
    try {
      const db = await this.getClient();

      // Fetch epics
      const { data: epics, error: epicError } = await db
        .from(this.tableName)
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (epicError || !epics) {
        return { data: null, error: epicError, success: false };
      }

      // For each epic, count total and done issues
      const epicIds = epics.map((e: any) => e.id);

      if (epicIds.length === 0) {
        return {
          data: epics.map((e: any) => ({ ...e, total_issues: 0, done_issues: 0 })),
          error: null,
          success: true,
        };
      }

      // Get all issues for these epics with their workflow state category
      const { data: issues, error: issueError } = await db
        .from("issues")
        .select("epic_id, workflow_states!issues_state_id_fkey ( category )")
        .in("epic_id", epicIds);

      if (issueError) {
        // Gracefully degrade: return epics with zero counts
        return {
          data: epics.map((e: any) => ({ ...e, total_issues: 0, done_issues: 0 })),
          error: null,
          success: true,
        };
      }

      // Aggregate counts per epic
      const countMap = new Map<string, { total: number; done: number }>();
      for (const issue of issues || []) {
        const epicId = issue.epic_id;
        if (!countMap.has(epicId)) {
          countMap.set(epicId, { total: 0, done: 0 });
        }
        const counts = countMap.get(epicId)!;
        counts.total++;
        const state = issue.workflow_states as any;
        if (state?.category === "done") {
          counts.done++;
        }
      }

      const result: EpicWithProgress[] = epics.map((e: any) => {
        const counts = countMap.get(e.id) || { total: 0, done: 0 };
        return { ...e, total_issues: counts.total, done_issues: counts.done };
      });

      return { data: result, error: null, success: true };
    } catch (error) {
      return { data: null, error: error as Error, success: false };
    }
  }
}
