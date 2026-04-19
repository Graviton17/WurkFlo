"use server";

import { projectService, sprintService, workflowStateService, issueService, epicService, releaseService } from "@/services/index";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type { ActionResult, Sprint, WorkflowState, IssueWithRelations, Epic, Release } from "@/types/index";

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
    sprints: Sprint[];
    epics: Epic[];
    releases: Release[];
  }>
> {
  try {
    await requireUser();

    const [projectRes, sprintRes, statesRes, allSprintsRes, epicsRes, releasesRes] = await Promise.all([
      projectService.getProjectById(projectId),
      sprintService.getActiveSprint(projectId),
      workflowStateService.getStatesByProject(projectId),
      sprintService.getSprintsByProject(projectId),
      epicService.getEpicsByProject(projectId),
      releaseService.getReleasesByProject(projectId),
    ]);

    const activeSprint = sprintRes.data ?? null;
    const workflowStates = statesRes.data ?? [];
    const projectIdentifier = projectRes.data?.identifier ?? "";

    // Only show planned + active sprints for assignment purposes
    const allSprints = allSprintsRes.data ?? [];
    const assignableSprints = allSprints.filter((s) => s.status === "planned" || s.status === "active");

    // Only fetch issues for the active sprint — the board is scoped to the active sprint only.
    // When no sprint is active, the UI renders a "No Active Sprint" CTA.
    let issues: IssueWithRelations[] = [];
    if (activeSprint) {
      const issuesRes = await issueService.getSprintIssues(activeSprint.id);
      issues = issuesRes.data ?? [];
    }

    return {
      success: true,
      data: {
        activeSprint,
        workflowStates,
        issues,
        projectIdentifier,
        workspaceId: projectRes.data?.workspace_id ?? "",
        sprints: assignableSprints,
        epics: epicsRes.data ?? [],
        releases: releasesRes.data ?? [],
      },
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
    sprints: Sprint[];
    epics: Epic[];
    releases: Release[];
  }>
> {
  try {
    await requireUser();

    const [projectRes, issuesRes, sprintsRes, epicsRes, releasesRes] = await Promise.all([
      projectService.getProjectById(projectId),
      issueService.getBacklog(projectId),
      sprintService.getSprintsByProject(projectId),
      epicService.getEpicsByProject(projectId),
      releaseService.getReleasesByProject(projectId),
    ]);

    // Filter to only planned sprints for DnD zones
    const allSprints = sprintsRes.data ?? [];
    const plannedSprints = allSprints.filter((s) => s.status === "planned");
    // Assignable sprints: planned + active
    const assignableSprints = allSprints.filter((s) => s.status === "planned" || s.status === "active");

    return {
      success: true,
      data: {
        issues: issuesRes.data ?? [],
        projectIdentifier: projectRes.data?.identifier ?? "",
        plannedSprints,
        workspaceId: projectRes.data?.workspace_id ?? "",
        sprints: assignableSprints,
        epics: epicsRes.data ?? [],
        releases: releasesRes.data ?? [],
      },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load backlog";
    logger.error({ err: error }, "getBacklogData failed");
    return { success: false, data: null, error: msg };
  }
}
