"use server";

import { revalidatePath } from "next/cache";
import { issueService, workflowStateService } from "@/services/index";
import { CreateIssueSchema, UpdateIssueSchema } from "@/types/validation";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type { ActionResult, Issue, IssueWithRelations } from "@/types/index";

/**
 * Move an issue to a new workflow state (drag-and-drop).
 */
export async function moveIssue(
  issueId: string,
  newStateId: string,
  projectId?: string,
): Promise<ActionResult<Issue>> {
  try {
    await requireUser();
    const result = await issueService.updateIssue(issueId, { state_id: newStateId } as Partial<Issue>);

    if (!result.success) {
      return { success: false, data: null, error: result.error?.message || "Failed to move issue" };
    }

    // Revalidate to keep server cache consistent with the optimistic UI
    if (projectId) {
      revalidatePath(`/dashboard/project/${projectId}`);
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to move issue";
    logger.error({ err: error }, "moveIssue failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Create a new issue with auto-generated sequence_id.
 */
export async function createIssue(
  data: Record<string, unknown>,
): Promise<ActionResult<Issue>> {
  try {
    await requireUser();

    const validation = CreateIssueSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        data: null,
        error: validation.error.issues.map((i) => i.message).join(", "),
      };
    }

    // Auto-assign default state_id if none provided
    let stateId = validation.data.state_id;
    if (!stateId) {
      const statesRes = await workflowStateService.getStatesByProject(
        validation.data.project_id,
      );
      const states = statesRes.data ?? [];
      if (states.length === 0) {
        return {
          success: false,
          data: null,
          error:
            "No workflow states configured for this project. Please set up workflow states before creating issues.",
        };
      }
      // Prefer the first 'todo'-category state, fallback to first state by position
      const sorted = [...states].sort((a, b) => a.position - b.position);
      const todoState = sorted.find((s) => s.category === "todo");
      stateId = todoState?.id ?? sorted[0].id;
    }

    const sequenceId = await issueService.getNextSequenceId(validation.data.project_id);

    const result = await issueService.createIssue({
      ...validation.data,
      state_id: stateId,
      sequence_id: sequenceId,
    } as Partial<Issue>);

    if (!result.success) {
      return { success: false, data: null, error: result.error?.message || "Failed to create issue" };
    }

    revalidatePath(`/dashboard/project/${validation.data.project_id}`);
    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create issue";
    logger.error({ err: error }, "createIssue failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Get full issue detail with all resolved relations.
 */
export async function getIssueDetail(issueId: string): Promise<
  ActionResult<IssueWithRelations>
> {
  try {
    await requireUser();
    const result = await issueService.getIssueDetail(issueId);

    if (!result.success || !result.data) {
      return { success: false, data: null, error: "Issue not found" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load issue";
    logger.error({ err: error }, "getIssueDetail failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Update specific properties of an issue (priority, assignee, estimate, etc.).
 */
export async function updateIssueProperty(
  issueId: string,
  data: Record<string, unknown>,
): Promise<ActionResult<Issue>> {
  try {
    await requireUser();

    const validation = UpdateIssueSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        data: null,
        error: validation.error.issues.map((i) => i.message).join(", "),
      };
    }

    const result = await issueService.updateIssue(issueId, validation.data as Partial<Issue>);

    if (!result.success) {
      return { success: false, data: null, error: result.error?.message || "Failed to update issue" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update issue";
    logger.error({ err: error }, "updateIssueProperty failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Delete an issue by ID.
 */
export async function deleteIssue(issueId: string): Promise<ActionResult<null>> {
  try {
    await requireUser();
    const result = await issueService.deleteIssue(issueId);

    if (!result.success) {
      return { success: false, data: null, error: result.error?.message || "Failed to delete issue" };
    }

    return { success: true, data: null };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to delete issue";
    logger.error({ err: error }, "deleteIssue failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Get issues assigned to the current user in a workspace, excluding "done" issues.
 */
export async function getMyIssues(workspaceId: string): Promise<
  ActionResult<IssueWithRelations[]>
> {
  try {
    const user = await requireUser();
    const result = await issueService.getMyIssues(user.id, workspaceId);
    return { success: true, data: result.data ?? [] };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load issues";
    logger.error({ err: error }, "getMyIssues failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Assign an issue to a sprint (or remove from sprint by passing null).
 * Used by the backlog DnD to move issues between sprint zones.
 */
export async function assignIssueToSprint(
  issueId: string,
  sprintId: string | null,
  projectId?: string,
): Promise<ActionResult<Issue>> {
  try {
    await requireUser();
    const result = await issueService.updateIssue(issueId, {
      sprint_id: sprintId,
    } as Partial<Issue>);

    if (!result.success) {
      return {
        success: false,
        data: null,
        error: result.error?.message || "Failed to assign issue to sprint",
      };
    }

    // Revalidate to keep backlog/sprint views consistent
    if (projectId) {
      revalidatePath(`/dashboard/project/${projectId}`);
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Failed to assign issue to sprint";
    logger.error({ err: error }, "assignIssueToSprint failed");
    return { success: false, data: null, error: msg };
  }
}
