import { NextResponse } from "next/server";
import { workflowStateService, projectService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";
import { z } from "zod";

const CreateDraftSchema = z.object({
  projectId: z.string().uuid({ message: "Valid project ID is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  category: z.enum(["todo", "in_progress", "done"]).default("todo"),
});

export const GET = withApiSetup({
  requireAuth: true,
  handler: async ({ req }) => {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId query parameter is required" },
        { status: 400 }
      );
    }

    const result = await workflowStateService.getStatesByProject(projectId);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const POST = withApiSetup({
  requireAuth: true,
  schema: CreateDraftSchema,
  handler: async ({ validatedData }) => {
    const { projectId, title, description, category } = validatedData!;
    
    // Using workflow_states as the items storage per request to avoid adding tables
    const result = await workflowStateService.createState({
      project_id: projectId,
      name: title, // Title mapped to name
      category: category as any, // Column state
      position: Date.now(), // Use timestamp for append-like sorting just in case
    });
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }
});
