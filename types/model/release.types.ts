import type { IssueWithRelations } from "./issue.types";

export interface Release {
  id: string;
  project_id: string;
  version: string;
  release_date: string | null;
  created_at: string;
}

/** Release with linked issues for changelog */
export interface ReleaseWithIssues extends Release {
  issues: IssueWithRelations[];
}
