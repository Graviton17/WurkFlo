"use server";

import { issueService, projectService, epicService } from "@/services/index";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type { ActionResult, IssueWithRelations, Project, Epic } from "@/types/index";

export type SearchResults = {
  issues: IssueWithRelations[];
  projects: Project[];
  epics: Epic[];
};

/**
 * Global search across issues, projects, and epics within a workspace.
 */
export async function globalSearch(
  query: string,
  workspaceId: string,
): Promise<ActionResult<SearchResults>> {
  try {
    await requireUser();

    if (!query || query.trim().length === 0) {
      return { success: true, data: { issues: [], projects: [], epics: [] } };
    }

    const searchTerm = query.trim();

    // Search issues by title
    const issuesPromise = issueService.searchIssues(searchTerm, workspaceId);

    // Search projects by name within workspace
    const projectsPromise = (async () => {
      const result = await projectService.getProjectsByWorkspace(workspaceId);
      if (!result.data) return [];
      return result.data.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    })();

    // Search epics within workspace projects
    const epicsPromise = (async () => {
      const projectsResult = await projectService.getProjectsByWorkspace(workspaceId);
      if (!projectsResult.data || projectsResult.data.length === 0) return [];

      const allEpics: Epic[] = [];
      for (const project of projectsResult.data) {
        const epicsResult = await epicService.getEpicsByProject(project.id);
        if (epicsResult.data) {
          allEpics.push(...epicsResult.data);
        }
      }
      return allEpics.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    })();

    const [issuesResult, projects, epics] = await Promise.all([
      issuesPromise,
      projectsPromise,
      epicsPromise,
    ]);

    return {
      success: true,
      data: {
        issues: issuesResult.data ?? [],
        projects,
        epics,
      },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Search failed";
    logger.error({ err: error }, "globalSearch failed");
    return { success: false, data: null, error: msg };
  }
}
