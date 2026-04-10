"use server";

import { releaseService, projectService } from "@/services/index";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type { ActionResult, Release, IssueWithRelations } from "@/types/index";

/**
 * Fetch releases for a project.
 */
export async function getReleasesData(projectId: string): Promise<
  ActionResult<{
    releases: Release[];
    projectIdentifier: string;
  }>
> {
  try {
    await requireUser();

    const [projectRes, releasesRes] = await Promise.all([
      projectService.getProjectById(projectId),
      releaseService.getReleasesByProject(projectId),
    ]);

    return {
      success: true,
      data: {
        releases: releasesRes.data ?? [],
        projectIdentifier: projectRes.data?.identifier ?? "",
      },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load releases";
    logger.error({ err: error }, "getReleasesData failed");
    return { success: false, data: null, error: msg };
  }
}

/**
 * Get changelog for a specific release.
 */
export async function getReleaseChangelog(releaseId: string): Promise<
  ActionResult<IssueWithRelations[]>
> {
  try {
    await requireUser();
    const result = await releaseService.getReleaseChangelog(releaseId);
    return { success: true, data: result.data ?? [] };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to load changelog";
    logger.error({ err: error }, "getReleaseChangelog failed");
    return { success: false, data: null, error: msg };
  }
}
