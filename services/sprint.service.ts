import { SprintCURD, SprintSnapshotCURD } from "@/curd/index";
import { Sprint, SprintDailySnapshot, DatabaseResponse } from "@/types/index";

export class SprintService {
  private sprintCurd: SprintCURD;
  private snapshotCurd: SprintSnapshotCURD;

  constructor() {
    this.sprintCurd = new SprintCURD();
    this.snapshotCurd = new SprintSnapshotCURD();
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

  /**
   * Get the currently active sprint for a project.
   */
  async getActiveSprint(
    projectId: string,
  ): Promise<DatabaseResponse<Sprint>> {
    return this.sprintCurd.getActiveSprint(projectId);
  }

  /**
   * Check whether the project already has an active sprint.
   */
  async hasActiveSprint(projectId: string): Promise<boolean> {
    return this.sprintCurd.hasActiveSprint(projectId);
  }

  // ── Burndown Snapshots ──

  /**
   * Capture today's snapshot for an active sprint.
   * Counts total issues and completed issues (workflow_state.category = 'done').
   */
  async captureSnapshot(
    sprintId: string,
    issues: { state_category: string | null; estimate: number | null }[],
  ): Promise<DatabaseResponse<SprintDailySnapshot>> {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const totalIssues = issues.length;
    const completedIssues = issues.filter(
      (i) => i.state_category === "done",
    ).length;
    const totalPoints = issues.reduce((sum, i) => sum + (i.estimate || 0), 0);
    const completedPoints = issues
      .filter((i) => i.state_category === "done")
      .reduce((sum, i) => sum + (i.estimate || 0), 0);

    return this.snapshotCurd.upsertSnapshot(sprintId, today, {
      total_issues: totalIssues,
      completed_issues: completedIssues,
      total_points: totalPoints,
      completed_points: completedPoints,
    });
  }

  /**
   * Get all burndown snapshots for a sprint (ordered by date).
   */
  async getSprintBurndown(
    sprintId: string,
  ): Promise<DatabaseResponse<SprintDailySnapshot[]>> {
    return this.snapshotCurd.getSnapshotsBySprint(sprintId);
  }
}

export const sprintService = new SprintService();

