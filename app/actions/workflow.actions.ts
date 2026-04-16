"use server";

import { revalidatePath } from "next/cache";
import { workflowStateService, projectService, issueService } from "@/services/index";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type { ActionResult, WorkflowState, StateCategoryEnum, IssueWithRelations } from "@/types/index";
import { z } from "zod";

const WorkflowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["todo", "in_progress", "done"]).optional().default("todo"),
  position: z.number().int().min(0).optional(),
});

export async function getWorkflowConfigData(projectId: string): Promise<ActionResult<{
  states: WorkflowState[];
  issues: IssueWithRelations[];
  workspaceId: string;
}>> {
  try {
    await requireUser();
    const [statesRes, issuesRes, projectRes] = await Promise.all([
      workflowStateService.getStatesByProject(projectId),
      issueService.getIssuesWithRelations(projectId),
      projectService.getProjectById(projectId)
    ]);

    return { 
      success: true, 
      data: {
        states: statesRes.data ?? [],
        issues: issuesRes.data ?? [],
        workspaceId: projectRes.data?.workspace_id ?? ""
      } 
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch workflow config";
    logger.error({ err: error }, "getWorkflowConfigData failed");
    return { success: false, data: null, error: msg };
  }
}

export async function getWorkflowStatesAction(projectId: string): Promise<ActionResult<WorkflowState[]>> {
  try {
    await requireUser();
    const result = await workflowStateService.getStatesByProject(projectId);
    
    if (!result.success || !result.data) {
      return { success: false, data: null, error: result.error?.message || "Failed to fetch workflow states" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch workflow states";
    logger.error({ err: error }, "getWorkflowStatesAction failed");
    return { success: false, data: null, error: msg };
  }
}

export async function createWorkflowState(projectId: string, data: Record<string, unknown>): Promise<ActionResult<WorkflowState>> {
  try {
    await requireUser();
    
    const parsed = WorkflowSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, data: null, error: parsed.error.issues[0].message };
    }

    const position = parsed.data.position ?? 0; // The service handles sequence if we pass 0

    const result = await workflowStateService.createState({
      project_id: projectId,
      name: parsed.data.name,
      category: parsed.data.category as StateCategoryEnum,
      position: position,
    });

    if (!result.success) {
      return { success: false, data: null, error: result.error?.message };
    }

    revalidatePath(`/dashboard/project/${projectId}/workflow-states`);
    revalidatePath(`/dashboard/project/${projectId}/board`);
    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create workflow state";
    logger.error({ err: error }, "createWorkflowState failed");
    return { success: false, data: null, error: msg };
  }
}

export async function updateWorkflowStatePositions(projectId: string, stateIdsInOrder: string[]): Promise<ActionResult<boolean>> {
  try {
    await requireUser();
    
    // Loop through and update positions
    // Warning: Not the most purely atomic approach, but functional for small lists.
    // Real-world would use a bulk update RPC.
    await Promise.all(stateIdsInOrder.map((id, index) => 
      workflowStateService.updateState(id, { position: index })
    ));

    revalidatePath(`/dashboard/project/${projectId}/workflow-states`);
    revalidatePath(`/dashboard/project/${projectId}/board`);
    return { success: true, data: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update workflow positions";
    logger.error({ err: error }, "updateWorkflowStatePositions failed");
    return { success: false, data: null, error: msg };
  }
}
