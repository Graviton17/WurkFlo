"use server";

import { revalidatePath } from "next/cache";
import { issueService } from "@/services/index";
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
): Promise<ActionResult<Issue>> {
  try {
    await requireUser();
    const result = await issueService.updateIssue(issueId, { state_id: newStateId } as Partial<Issue>);

    if (!result.success) {
      return { success: false, data: null, error: result.error?.message || "Failed to move issue" };
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

    const sequenceId = await issueService.getNextSequenceId(validation.data.project_id);

    const result = await issueService.createIssue({
      ...validation.data,
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
