import { NextResponse } from "next/server";
import { workflowStateService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";
import { CreateWorkflowStateSchema } from "@/types/validation";

export const GET = withApiSetup({
  requireAuth: true,
  handler: async ({ params }) => {
    const result = await workflowStateService.getStatesByProject(params.id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const POST = withApiSetup({
  requireAuth: true,
  schema: CreateWorkflowStateSchema,
  handler: async ({ params, validatedData }) => {
    const payload = { ...validatedData!, project_id: params.id };
    const result = await workflowStateService.createState(payload);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }
});
