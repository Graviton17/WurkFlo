import { NextRequest, NextResponse } from "next/server";
import { workflowStateService } from "@/services/index";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId query parameter is required" },
        { status: 400 },
      );
    }

    const result = await workflowStateService.getStatesByProject(projectId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error?.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
