"use server";

import { revalidatePath } from "next/cache";
import { sprintService, projectService, issueService } from "@/services/index";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type { ActionResult, Sprint, SprintStatus, Issue } from "@/types/index";
import { z } from "zod";

const SprintSchema = z.object({
  name: z.string().min(1, "Name is required"),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  status: z.enum(["planned", "active", "completed", "cancelled"]).optional().default("planned"),
});

export async function getProjectSprintsData(projectId: string): Promise<ActionResult<{
  sprints: Sprint[];
  issues: Issue[];
  projectIdentifier: string;
}>> {
  try {
    await requireUser();
    
    const [projectRes, sprintsRes, issuesRes] = await Promise.all([
      projectService.getProjectById(projectId),
      sprintService.getSprintsByProject(projectId),
      issueService.getIssuesWithRelations(projectId)
    ]);

    return { 
      success: true, 
      data: {
        sprints: sprintsRes.data ?? [],
        issues: issuesRes.data ?? [],
        projectIdentifier: projectRes.data?.identifier ?? ""
      }
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch sprints data";
    logger.error({ err: error }, "getProjectSprintsData failed");
    return { success: false, data: null, error: msg };
  }
}

export async function createSprint(projectId: string, data: Record<string, unknown>): Promise<ActionResult<Sprint>> {
  try {
    await requireUser();
    
    const parsed = SprintSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, data: null, error: parsed.error.issues[0].message };
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
    const msg = error instanceof Error ? error.message : "Failed to create sprint";
    logger.error({ err: error }, "createSprint failed");
    return { success: false, data: null, error: msg };
  }
}

export async function updateSprintStatus(sprintId: string, projectId: string, status: SprintStatus): Promise<ActionResult<Sprint>> {
  try {
    await requireUser();
    
    // The service handles completing other sprints if this one becomes "active"
    const result = await sprintService.updateSprint(sprintId, { status });
    
    if (!result.success) {
      return { success: false, data: null, error: result.error?.message };
    }

    revalidatePath(`/dashboard/project/${projectId}`);
    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update sprint status";
    logger.error({ err: error }, "updateSprintStatus failed");
    return { success: false, data: null, error: msg };
  }
}
