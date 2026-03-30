import { NextResponse } from "next/server";
import { projectService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";
import { CreateProjectSchema } from "@/types/validation";

export const GET = withApiSetup({
  requireAuth: true,
  handler: async ({ req }) => {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get('workspaceId');
    
    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: "workspaceId query parameter is required" },
        { status: 400 }
      );
    }

    const result = await projectService.getProjectsByWorkspace(workspaceId);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const POST = withApiSetup({
  requireAuth: true,
  schema: CreateProjectSchema,
  handler: async ({ validatedData }) => {
    const result = await projectService.createProject(validatedData!);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }
});
