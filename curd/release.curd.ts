import { BaseCURD } from "./base_curd.curd";
import type { Release } from "@/types/model/release.types";
import type { ReleaseWithProgress, DatabaseResponse } from "@/types/index";

export class ReleaseCURD extends BaseCURD<Release> {
  constructor() {
    super("releases");
  }

  /**
   * Get all releases for a project with aggregated issue counts.
   * Returns total_issues and completed_issues for each release.
   */
  async getByProjectWithIssueCounts(
    projectId: string,
  ): Promise<DatabaseResponse<ReleaseWithProgress[]>> {
    try {
      const db = await this.getClient();

      // Fetch releases
      const { data: releases, error: releaseError } = await db
        .from(this.tableName)
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (releaseError || !releases) {
        return { data: null, error: releaseError, success: false };
      }

      const releaseIds = releases.map((r: any) => r.id);

      if (releaseIds.length === 0) {
        return {
          data: releases.map((r: any) => ({
            ...r,
            total_issues: 0,
            completed_issues: 0,
          })),
          error: null,
          success: true,
        };
      }

      // Get all issues for these releases with their workflow state category
      const { data: issues, error: issueError } = await db
        .from("issues")
        .select(
          "release_id, workflow_states!issues_state_id_fkey ( category )",
        )
        .in("release_id", releaseIds);

      if (issueError) {
        // Gracefully degrade: return releases with zero counts
        return {
          data: releases.map((r: any) => ({
            ...r,
            total_issues: 0,
            completed_issues: 0,
          })),
          error: null,
          success: true,
        };
      }

      // Aggregate counts per release
      const countMap = new Map<
        string,
        { total: number; completed: number }
      >();
      for (const issue of issues || []) {
        const releaseId = issue.release_id;
        if (!countMap.has(releaseId)) {
          countMap.set(releaseId, { total: 0, completed: 0 });
        }
        const counts = countMap.get(releaseId)!;
        counts.total++;
        const state = issue.workflow_states as any;
        if (state?.category === "done") {
          counts.completed++;
        }
      }

      const result: ReleaseWithProgress[] = releases.map((r: any) => {
        const counts = countMap.get(r.id) || { total: 0, completed: 0 };
        return {
          ...r,
          total_issues: counts.total,
          completed_issues: counts.completed,
        };
      });

      return { data: result, error: null, success: true };
    } catch (error) {
      return { data: null, error: error as Error, success: false };
    }
  }
}
