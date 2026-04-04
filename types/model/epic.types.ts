export interface Epic {
  id: string;
  project_id: string;
  name: string;
  target_date: string | null;
  created_at: string;
}
