"use server";

import { revalidatePath } from "next/cache";
import { sprintService, projectService, issueService } from "@/services/index";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type {
  ActionResult,
  Sprint,
  SprintStatus,
  IssueWithRelations,
  SprintDailySnapshot,
} from "@/types/index";
import { z } from "zod";

const SprintSchema = z.object({
  name: z.string().min(1, "Name is required"),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z
    .enum(["planned", "active", "completed", "cancelled"])
    .optional()
    .default("planned"),
});

/**
 * Fetch all sprints for a project with their issues (with relations).
 */
export async function getProjectSprintsData(
  projectId: string,
): Promise<
  ActionResult<{
    sprints: Sprint[];
    issues: IssueWithRelations[];
    projectIdentifier: string;
    hasActiveSprint: boolean;
  }>
> {
  try {
    await requireUser();

    const [projectRes, sprintsRes, issuesRes, hasActive] = await Promise.all([
      projectService.getProjectById(projectId),
      sprintService.getSprintsByProject(projectId),
      issueService.getIssuesWithRelations(projectId),
      sprintService.hasActiveSprint(projectId),
    ]);

    return {
      success: true,
      data: {
        sprints: sprintsRes.data ?? [],
        issues: issuesRes.data ?? [],
        projectIdentifier: projectRes.data?.identifier ?? "",
        hasActiveSprint: hasActive,
      },
    };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to fetch sprints data";
    logger.error({ err: error }, "getProjectSprintsData failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Create a new sprint (always starts as "planned").
 */
export async function createSprint(
  projectId: string,
  data: Record<string, unknown>,
): Promise<ActionResult<Sprint>> {
  try {
    await requireUser();

    const parsed = SprintSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        data: null,
        error: parsed.error.issues[0].message,
      };
    }

    const result = await sprintService.createSprint({
      project_id: projectId,
      name: parsed.data.name,
      start_date: parsed.data.start_date || undefined,
      end_date: parsed.data.end_date || undefined,
      status: parsed.data.status as SprintStatus,
    });

    if (!result.success) {
      return { success: false, data: null, error: result.error?.message };
    }

    revalidatePath(`/dashboard/project/${projectId}/sprints`);
    return { success: true, data: result.data };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to create sprint";
    logger.error({ err: error }, "createSprint failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Start a sprint: enforces single-active-sprint paradigm.
 * Returns an error if another sprint is already active.
 */
export async function startSprint(
  sprintId: string,
  projectId: string,
): Promise<ActionResult<Sprint>> {
  try {
    await requireUser();

    // Guard: check if there's already an active sprint
    const isActive = await sprintService.hasActiveSprint(projectId);
    if (isActive) {
      return {
        success: false,
        data: null,
        error:
          "A sprint is already active. Complete the current sprint before starting a new one.",
      };
    }

    // Activate the sprint
    const result = await sprintService.updateSprint(sprintId, {
      status: "active",
    });

    if (!result.success) {
      return {
        success: false,
        data: null,
        error: result.error?.message || "Failed to start sprint",
      };
    }

    // Capture initial burndown snapshot
    try {
      const issuesRes = await issueService.getSprintIssues(sprintId);
      const sprintIssues = issuesRes.data ?? [];
      await sprintService.captureSnapshot(
        sprintId,
        sprintIssues.map((i) => ({
          state_category: i.workflow_state?.category ?? null,
          estimate: i.estimate,
        })),
      );
    } catch (snapErr) {
      logger.warn({ err: snapErr }, "Failed to capture initial snapshot");
    }

    revalidatePath(`/dashboard/project/${projectId}`);
    return { success: true, data: result.data };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to start sprint";
    logger.error({ err: error }, "startSprint failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Complete a sprint with rollover logic for incomplete issues.
 * @param rolloverTarget - "backlog" to set sprint_id=null, or a sprint UUID
 */
export async function completeSprint(
  sprintId: string,
  projectId: string,
  rolloverTarget: "backlog" | string,
): Promise<ActionResult<Sprint>> {
  try {
    await requireUser();

    // 1. Get all issues in this sprint to find incomplete ones
    const issuesRes = await issueService.getSprintIssues(sprintId);
    const sprintIssues = issuesRes.data ?? [];

    // 2. Capture final burndown snapshot before completing
    try {
      await sprintService.captureSnapshot(
        sprintId,
        sprintIssues.map((i) => ({
          state_category: i.workflow_state?.category ?? null,
          estimate: i.estimate,
        })),
      );
    } catch (snapErr) {
      logger.warn({ err: snapErr }, "Failed to capture final snapshot");
    }

    // 3. Move incomplete issues based on rollover target
    const incompleteIssues = sprintIssues.filter(
      (i) => i.workflow_state?.category !== "done",
    );

    if (incompleteIssues.length > 0) {
      const newSprintId =
        rolloverTarget === "backlog" ? null : rolloverTarget;

      await Promise.all(
        incompleteIssues.map((issue) =>
          issueService.updateIssue(issue.id, {
            sprint_id: newSprintId,
          } as any),
        ),
      );
    }

    // 4. Mark sprint as completed
    const result = await sprintService.updateSprint(sprintId, {
      status: "completed",
    });

    if (!result.success) {
      return {
        success: false,
        data: null,
        error: result.error?.message || "Failed to complete sprint",
      };
    }

    revalidatePath(`/dashboard/project/${projectId}`);
    return { success: true, data: result.data };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to complete sprint";
    logger.error({ err: error }, "completeSprint failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Get burndown chart data for a sprint.
 */
export async function getSprintBurndownData(
  sprintId: string,
): Promise<ActionResult<SprintDailySnapshot[]>> {
  try {
    await requireUser();
    const result = await sprintService.getSprintBurndown(sprintId);
    return { success: true, data: result.data ?? [] };
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : "Failed to load burndown data";
    logger.error({ err: error }, "getSprintBurndownData failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Delete a planned sprint (only allowed for planned status).
 */
export async function deleteSprint(
  sprintId: string,
  projectId: string,
): Promise<ActionResult<null>> {
  try {
    await requireUser();

    // Verify sprint is planned before deleting
    const sprintRes = await sprintService.getSprintById(sprintId);
    if (!sprintRes.data) {
      return { success: false, data: null, error: "Sprint not found" };
    }
    if (sprintRes.data.status !== "planned") {
      return {
        success: false,
        data: null,
        error: "Only planned sprints can be deleted",
      };
    }

    const result = await sprintService.deleteSprint(sprintId);
    if (!result.success) {
      return {
        success: false,
        data: null,
        error: result.error?.message || "Failed to delete sprint",
      };
    }

    revalidatePath(`/dashboard/project/${projectId}/sprints`);
    return { success: true, data: null };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to delete sprint";
    logger.error({ err: error }, "deleteSprint failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Capture a burndown snapshot for the currently active sprint.
 * Intended to be called on issue state changes or periodically.
 */
export async function captureSprintSnapshot(
  sprintId: string,
  projectId: string,
): Promise<ActionResult<SprintDailySnapshot>> {
  try {
    await requireUser();
    const issuesRes = await issueService.getSprintIssues(sprintId);
    const sprintIssues = issuesRes.data ?? [];

    const result = await sprintService.captureSnapshot(
      sprintId,
      sprintIssues.map((i) => ({
        state_category: i.workflow_state?.category ?? null,
        estimate: i.estimate,
      })),
    );

    return { success: true, data: result.data };
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : "Failed to capture snapshot";
    logger.error({ err: error }, "captureSprintSnapshot failed");
    return { success: false, data: null, error: msg };
  }
}
