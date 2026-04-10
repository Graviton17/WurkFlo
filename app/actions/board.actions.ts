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
      data: { activeSprint, workflowStates, issues, projectIdentifier },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load board data";
    logger.error({ err: error }, "getSprintBoardData failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Fetch backlog data: issues with no sprint assigned + project identifier.
 */
export async function getBacklogData(projectId: string): Promise<
  ActionResult<{
    issues: IssueWithRelations[];
    projectIdentifier: string;
  }>
> {
  try {
    await requireUser();

    const [projectRes, issuesRes] = await Promise.all([
      projectService.getProjectById(projectId),
      issueService.getBacklog(projectId),
    ]);

    return {
      success: true,
      data: {
        issues: issuesRes.data ?? [],
        projectIdentifier: projectRes.data?.identifier ?? "",
      },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load backlog";
    logger.error({ err: error }, "getBacklogData failed");
    return { success: false, data: null, error: msg };
  }
}
