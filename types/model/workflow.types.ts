/**
 * State category enum mapping to public.state_category_enum
 */
export type StateCategoryEnum = "todo" | "in_progress" | "done";

/**
 * Workflow State interface representing the public.workflow_states table
 */
export interface WorkflowState {
  id: string; // UUID
  project_id: string; // UUID references projects(id)
  name: string;
  position: number; // Float
  category: StateCategoryEnum;
  created_at: string; // TIMESTAMP WITH TIME ZONE
}
