/**
 * Workspace role enum mapping to public.workspace_role
 */
export type WorkspaceRole = "owner" | "admin" | "member" | "guest";

/**
 * Workspace interface representing the public.workspaces table
 */
export interface Workspace {
  id: string; // UUID
  name: string;
  slug: string;
  created_at: string; // TIMESTAMP WITH TIME ZONE
}

/**
 * Workspace Member interface representing the public.workspace_members table
 */
export interface WorkspaceMember {
  workspace_id: string; // UUID references workspaces(id)
  user_id: string; // UUID references users(id)
  role: WorkspaceRole;
  created_at: string; // TIMESTAMP WITH TIME ZONE
}
