"use server";

import { requireUser } from "./utils";
import { workspaceService } from "@/services/index";
import { CreateWorkspaceSchema, UpdateWorkspaceSchema } from "@/types/validation";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import type { ActionResult, Workspace, WorkspaceWithRole } from "@/types/index";

export async function getUserWorkspacesAction(): Promise<ActionResult<WorkspaceWithRole[]>> {
  try {
    const user = await requireUser();
    const result = await workspaceService.getAllWorkspacesByUserId(user.id);

    return {
      success: true,
      data: (result.data || []).map((ws: any) => ({
        ...ws,
        role: ws.role ?? "member",
      })),
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch workspaces";
    logger.error({ err: error }, "getUserWorkspacesAction failed");
    return { success: false, data: null, error: msg };
  }
}

export async function getWorkspaceByIdAction(workspaceId: string): Promise<ActionResult<Workspace>> {
  try {
    await requireUser();
    const result = await workspaceService.getWorkspaceById(workspaceId);

    if (!result.success || !result.data) {
      return { success: false, data: null, error: result.error?.message || "Workspace not found" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch workspace";
    logger.error({ err: error }, "getWorkspaceByIdAction failed");
    return { success: false, data: null, error: msg };
  }
}

export async function createWorkspaceAction(data: Record<string, unknown>): Promise<ActionResult<Workspace>> {
  try {
    const user = await requireUser();
    
    const parsed = CreateWorkspaceSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, data: null, error: "Invalid workspace data" };
    }

    const validatedData = parsed.data;
    // Append a simple random string to the slug to prevent unique constraint violations
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    validatedData.slug = `${validatedData.slug}-${randomSuffix}`;

    const result = await workspaceService.createWorkspace(validatedData, user.id);
    
    if (!result.success || !result.data) {
      return { success: false, data: null, error: result.error?.message || "Failed to create workspace" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create workspace";
    logger.error({ err: error }, "createWorkspaceAction failed");
    return { success: false, data: null, error: msg };
  }
}

export async function updateWorkspaceAction(workspaceId: string, data: Record<string, unknown>): Promise<ActionResult<Workspace>> {
  try {
    await requireUser();
    
    const parsed = UpdateWorkspaceSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, data: null, error: "Invalid workspace data" };
    }

    const result = await workspaceService.updateWorkspace(workspaceId, parsed.data);
    
    if (!result.success || !result.data) {
      return { success: false, data: null, error: result.error?.message || "Failed to update workspace" };
    }

    revalidatePath(`/dashboard/workspace/${workspaceId}`);

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update workspace";
    logger.error({ err: error }, "updateWorkspaceAction failed");
    return { success: false, data: null, error: msg };
  }
}

export async function getWorkspaceMembersAction(workspaceId: string): Promise<ActionResult<any[]>> {
  try {
    await requireUser();
    const result = await workspaceService.getWorkspaceMembersWithProfiles(workspaceId);

    if (!result.success || !result.data) {
      return { success: false, data: null, error: result.error?.message || "Workspace members not found" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch workspace members";
    logger.error({ err: error }, "getWorkspaceMembersAction failed");
    return { success: false, data: null, error: msg };
  }
}
