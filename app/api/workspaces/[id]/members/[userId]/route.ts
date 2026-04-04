import { NextResponse } from "next/server";
import { workspaceService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";

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
