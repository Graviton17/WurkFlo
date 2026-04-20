export type IssueType = 'task' | 'bug' | 'story';
export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Issue {
  id: string;
  workspace_id: string;
  project_id: string;
  
  sprint_id: string | null;
  epic_id: string | null;
  release_id: string | null;
  state_id: string | null;
  assignee_id: string | null;
  
  parent_issue_id: string | null;
  
  sequence_id: number;
  issue_type: IssueType;
  title: string;
  description: any | null; // JSONB
  priority: IssuePriority;
  estimate: number | null;
  
  created_at: string;
  updated_at: string;
}

/** Issue with all related data resolved via JOINs */
export interface IssueWithRelations extends Issue {
  assignee?: { id: string; full_name: string | null; avatar_url: string | null } | null;
  workflow_state?: { id: string; name: string; category: string } | null;
  sprint?: { id: string; name: string } | null;
  epic?: { id: string; name: string } | null;
  release?: { id: string; version: string } | null;
  project?: { id: string; name: string; identifier: string } | null;
}
