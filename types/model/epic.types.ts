export interface Epic {
  id: string;
  project_id: string;
  name: string;
  target_date: string | null;
  created_at: string;
}

/** Epic with aggregated issue progress */
export interface EpicWithProgress extends Epic {
  total_issues: number;
  done_issues: number;
}
