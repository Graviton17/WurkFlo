/**
 * SprintDailySnapshot represents a daily progress capture for burndown charts.
 * Maps to public.sprint_daily_snapshots table.
 */
export interface SprintDailySnapshot {
  id: string;
  sprint_id: string;
  snapshot_date: string; // ISO date string (YYYY-MM-DD)
  total_issues: number;
  completed_issues: number;
  total_points: number;
  completed_points: number;
  created_at?: string;
}
