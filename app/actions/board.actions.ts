"use server";

import { projectService, sprintService, workflowStateService, issueService } from "@/services/index";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type { ActionResult, Sprint, WorkflowState, IssueWithRelations } from "@/types/index";

/**
 * Fetch everything needed for the Kanban board in a single call:
 * active sprint, workflow states, and sprint issues with relations.
 */
export async function getSprintBoardData(projectId: string): Promise<
  ActionResult<{
    activeSprint: Sprint | null;
    workflowStates: WorkflowState[];
    issues: IssueWithRelations[];
    projectIdentifier: string;
    workspaceId: string;
  }>
> {
  try {
    await requireUser();

    const [projectRes, sprintRes, statesRes] = await Promise.all([
      projectService.getProjectById(projectId),
      sprintService.getActiveSprint(projectId),
      workflowStateService.getStatesByProject(projectId),
    ]);

    const activeSprint = sprintRes.data ?? null;
    const workflowStates = statesRes.data ?? [];
    const projectIdentifier = projectRes.data?.identifier ?? "";

    // If there's an active sprint, fetch its issues; otherwise fetch all project issues
    let issues: IssueWithRelations[] = [];
    if (activeSprint) {
      const issuesRes = await issueService.getSprintIssues(activeSprint.id);
      issues = issuesRes.data ?? [];
    } else {
      const issuesRes = await issueService.getIssuesWithRelations(projectId);
      issues = issuesRes.data ?? [];
    }

    return {
      success: true,
      data: { activeSprint, workflowStates, issues, projectIdentifier, workspaceId: projectRes.data?.workspace_id ?? "" },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load board data";
    logger.error({ err: error }, "getSprintBoardData failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Fetch backlog data: issues with no sprint or in planned sprints,
 * plus list of planned sprints for DnD drop zones.
 */
export async function getBacklogData(projectId: string): Promise<
  ActionResult<{
    issues: IssueWithRelations[];
    projectIdentifier: string;
    plannedSprints: Sprint[];
    workspaceId: string;
  }>
> {
  try {
    await requireUser();

    const [projectRes, issuesRes, sprintsRes] = await Promise.all([
      projectService.getProjectById(projectId),
      issueService.getBacklog(projectId),
      sprintService.getSprintsByProject(projectId),
    ]);

    // Filter to only planned sprints
    const allSprints = sprintsRes.data ?? [];
    const plannedSprints = allSprints.filter((s) => s.status === "planned");

    return {
      success: true,
      data: {
        issues: issuesRes.data ?? [],
        projectIdentifier: projectRes.data?.identifier ?? "",
        plannedSprints,
        workspaceId: projectRes.data?.workspace_id ?? "",
      },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load backlog";
    logger.error({ err: error }, "getBacklogData failed");
    return { success: false, data: null, error: msg };
  }
}
