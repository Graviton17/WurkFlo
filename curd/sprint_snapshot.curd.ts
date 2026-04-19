import { BaseCURD } from "./base_curd.curd";
import type { SprintDailySnapshot } from "@/types/index";
import type { DatabaseResponse } from "@/types/index";

export class SprintSnapshotCURD extends BaseCURD<SprintDailySnapshot> {
  constructor() {
    super("sprint_daily_snapshots");
  }

  /**
   * Upsert a snapshot for a given sprint and date.
   * Uses the UNIQUE(sprint_id, snapshot_date) constraint.
   */
  async upsertSnapshot(
    sprintId: string,
    snapshotDate: string,
    counts: {
      total_issues: number;
      completed_issues: number;
      total_points: number;
      completed_points: number;
    },
  ): Promise<DatabaseResponse<SprintDailySnapshot>> {
    try {
      const db = await this.getClient();
      const { data, error } = await (db.from(this.tableName) as any)
        .upsert(
          {
            sprint_id: sprintId,
            snapshot_date: snapshotDate,
            ...counts,
          },
          { onConflict: "sprint_id,snapshot_date" },
        )
        .select()
        .maybeSingle();

      return {
        data: data as SprintDailySnapshot | null,
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
   * Get all snapshots for a sprint, ordered by date ascending.
   */
  async getSnapshotsBySprint(
    sprintId: string,
  ): Promise<DatabaseResponse<SprintDailySnapshot[]>> {
    return this.customQuery<SprintDailySnapshot[]>((table) =>
      table
        .select("*")
        .eq("sprint_id", sprintId)
        .order("snapshot_date", { ascending: true }),
    );
  }
}
