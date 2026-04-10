"use server";

import { releaseService, projectService } from "@/services/index";
import { logger } from "@/lib/logger";
import { requireUser } from "./utils";
import type { ActionResult, Release, IssueWithRelations } from "@/types/index";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const ReleaseSchema = z.object({
  version: z.string().min(1, "Version is required"),
  release_date: z.string().optional().nullable(),
});

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

/**
 * Create a new release for a project.
 */
export async function createRelease(
  projectId: string,
  data: Record<string, unknown>
): Promise<ActionResult<Release>> {
  try {
    await requireUser();

    const parsed = ReleaseSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, data: null, error: parsed.error.issues[0].message };
    }

    const payload = {
      project_id: projectId,
      version: parsed.data.version,
      release_date: parsed.data.release_date || null,
    };

    const result = await releaseService.createRelease(payload);

    if (!result.success) {
      return { success: false, data: null, error: result.error?.message };
    }

    revalidatePath(`/dashboard/project/${projectId}/releases`);
    return { success: true, data: result.data };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create release";
    logger.error({ err: error }, "createRelease failed");
    return { success: false, data: null, error: msg };
  }
}
