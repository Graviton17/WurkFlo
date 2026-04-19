"use server";

import { requireUser } from "./utils";
import { projectService, workflowStateService } from "@/services/index";
import { CreateProjectSchema } from "@/types/validation";
import { logger } from "@/lib/logger";
import type { ActionResult, Project } from "@/types/index";

export async function createProjectAction(data: Record<string, unknown>): Promise<ActionResult<Project>> {
  try {
    await requireUser();
    
    const parsed = CreateProjectSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, data: null, error: "Invalid project data" };
    }

    const result = await projectService.createProject(parsed.data);
    
    if (!result.success || !result.data) {
      return { success: false, data: null, error: result.error?.message || "Failed to create project" };
    }

    const newProject = result.data;

    // Create default workflow states
    await Promise.all([
      workflowStateService.createState({ project_id: newProject.id, name: "Todo", category: "todo", position: 1 }),
      workflowStateService.createState({ project_id: newProject.id, name: "In Progress", category: "in_progress", position: 2 }),
      workflowStateService.createState({ project_id: newProject.id, name: "Done", category: "done", position: 3 })
    ]).catch(err => {
      // Log but don't fail the project creation if this partially fails
      logger.error({ err }, "Failed to auto-create default workflow states");
    });

    return { success: true, data: newProject };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create project";
    logger.error({ err: error }, "createProjectAction failed");
    return { success: false, data: null, error: msg };
  }
}

export async function getProjectData(projectId: string): Promise<ActionResult<Project>> {
  try {
    await requireUser();
    const result = await projectService.getProjectById(projectId);
    
    if (!result.success || !result.data) {
      return { success: false, data: null, error: result.error?.message || "Failed to fetch project" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch project";
    logger.error({ err: error }, "getProjectData failed");
    return { success: false, data: null, error: msg };
  }
}

export async function getWorkspaceProjectsData(workspaceId: string): Promise<ActionResult<Project[]>> {
  try {
    await requireUser();
    const result = await projectService.getProjectsByWorkspace(workspaceId);
    
    if (!result.success || !result.data) {
      return { success: false, data: null, error: result.error?.message || "Failed to fetch projects" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch projects";
    logger.error({ err: error }, "getWorkspaceProjectsData failed");
    return { success: false, data: null, error: msg };
  }
}
