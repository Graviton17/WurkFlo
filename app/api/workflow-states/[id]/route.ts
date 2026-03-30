import { NextResponse } from "next/server";
import { workflowStateService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";

export const GET = withApiSetup({
  requireAuth: true,
  handler: async ({ params }) => {
    const result = await workflowStateService.getStateById(params.id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const PUT = withApiSetup({
  requireAuth: true,
  handler: async ({ req, params }) => {
    const body = await req.json();
    const result = await workflowStateService.updateState(params.id, body);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const DELETE = withApiSetup({
  requireAuth: true,
  handler: async ({ params }) => {
    const result = await workflowStateService.deleteState(params.id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, message: "Workflow state deleted successfully" });
  }
});
