"use server";

import { epicService, projectService } from "@/services/index";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type { ActionResult, EpicWithProgress } from "@/types/index";

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
