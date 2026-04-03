export type SprintStatus = "planned" | "active" | "completed";

export interface Sprint {
  id: string;
  project_id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  status: SprintStatus;
  created_at: string;
}
