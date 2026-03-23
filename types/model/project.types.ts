/**
 * Project interface representing the public.projects table
 */
export interface Project {
  id: string; // UUID
  workspace_id: string; // UUID references workspaces(id)
  name: string;
  identifier: string; // Unique within workspace
  description: string | null;
  created_at: string; // TIMESTAMP WITH TIME ZONE
}
