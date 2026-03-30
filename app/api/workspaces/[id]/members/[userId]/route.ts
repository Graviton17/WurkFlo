import { NextResponse } from "next/server";
import { workspaceService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";

export const PUT = withApiSetup({
  requireAuth: true,
  handler: async ({ req, params }) => {
    const body = await req.json();
    const { role } = body;
    
    if (!role) {
      return NextResponse.json({ success: false, error: "role is required" }, { status: 400 });
    }

    const { id, userId } = params;
    const result = await workspaceService.updateMemberRole(id, userId, role);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const DELETE = withApiSetup({
  requireAuth: true,
  handler: async ({ params }) => {
    const { id, userId } = params;
    const result = await workspaceService.removeMember(id, userId);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, message: "Workspace member removed successfully" });
  }
});
