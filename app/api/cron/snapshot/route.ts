import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sprintService, issueService } from "@/services/index";
import { logger } from "@/lib/logger";

/**
 * GET /api/cron/snapshot
 *
 * Daily cron endpoint that captures burndown snapshots for all active sprints.
 * Protected by CRON_SECRET query parameter.
 *
 * Can be triggered by:
 * - Vercel Cron (vercel.json config)
 * - External scheduler (GitHub Actions, uptime monitor, etc.)
 * - Manual curl: GET /api/cron/snapshot?secret=YOUR_SECRET
 */
export async function GET(request: Request) {
  try {
    // Validate cron secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      logger.warn("CRON_SECRET not configured — skipping auth check");
    } else if (secret !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query all active sprints
    const db = await createServerSupabaseClient();
    const { data: activeSprints, error: sprintsError } = await db
      .from("sprints")
      .select("id, project_id, name")
      .eq("status", "active");

    if (sprintsError) {
      logger.error({ err: sprintsError }, "Failed to fetch active sprints");
      return NextResponse.json(
        { error: "Failed to fetch active sprints" },
        { status: 500 },
      );
    }

    if (!activeSprints || activeSprints.length === 0) {
      return NextResponse.json({
        message: "No active sprints found",
        snapshots: 0,
      });
    }

    // Capture snapshot for each active sprint
    const results: { sprintId: string; sprintName: string; success: boolean }[] = [];

    for (const sprint of activeSprints) {
      try {
        const issuesRes = await issueService.getSprintIssues(sprint.id);
        const sprintIssues = issuesRes.data ?? [];

        await sprintService.captureSnapshot(
          sprint.id,
          sprintIssues.map((i) => ({
            state_category: i.workflow_state?.category ?? null,
            estimate: i.estimate,
          })),
        );

        results.push({
          sprintId: sprint.id,
          sprintName: sprint.name,
          success: true,
        });
      } catch (err) {
        logger.error(
          { err, sprintId: sprint.id },
          "Failed to capture snapshot for sprint",
        );
        results.push({
          sprintId: sprint.id,
          sprintName: sprint.name,
          success: false,
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    logger.info(
      { total: results.length, successful },
      "Daily snapshot cron completed",
    );

    return NextResponse.json({
      message: `Captured ${successful}/${results.length} snapshots`,
      snapshots: successful,
      results,
    });
  } catch (error) {
    logger.error({ err: error }, "Cron snapshot endpoint failed");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
