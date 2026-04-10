"use server";

import { epicService, projectService } from "@/services/index";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type { ActionResult, Epic, EpicWithProgress } from "@/types/index";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const EpicSchema = z.object({
  name: z.string().min(1, "Name is required"),
  target_date: z.string().optional().nullable(),
});

/**
 * Fetch epics with progress data for a project.
 */
export async function getEpicsData(projectId: string): Promise<
  ActionResult<{
    epics: EpicWithProgress[];
    projectIdentifier: string;
  }>
> {
  try {
    await requireUser();

    const [projectRes, epicsRes] = await Promise.all([
      projectService.getProjectById(projectId),
      epicService.getEpicsWithProgress(projectId),
    ]);

    return {
      success: true,
      data: {
        epics: epicsRes.data ?? [],
        projectIdentifier: projectRes.data?.identifier ?? "",
      },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load epics";
    logger.error({ err: error }, "getEpicsData failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Create a new epic for a project.
 */
export async function createEpic(
  projectId: string,
  data: Record<string, unknown>
): Promise<ActionResult<Epic>> {
  try {
    await requireUser();

    const parsed = EpicSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, data: null, error: parsed.error.issues[0].message };
    }

    const payload = {
      project_id: projectId,
      name: parsed.data.name,
      target_date: parsed.data.target_date || null,
    };

    const result = await epicService.createEpic(payload);

    if (!result.success) {
      return { success: false, data: null, error: result.error?.message };
    }

    revalidatePath(`/dashboard/project/${projectId}/epics`);
    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create epic";
    logger.error({ err: error }, "createEpic failed");
    return { success: false, data: null, error: msg };
  }
}
