import { NextResponse } from "next/server";
import { workspaceService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";

export const GET = withApiSetup({
  requireAuth: true,
  handler: async ({ params }) => {
    const result = await workspaceService.getWorkspaceById(params.id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const PUT = withApiSetup({
  requireAuth: true,
  handler: async ({ req, user, params }) => {
    // RBAC Check
    const { data: members } = await workspaceService.getWorkspaceMembers(params.id);
    const currentUserMember = members?.find(m => m.user_id === user!.id);
    
    if (!currentUserMember || (currentUserMember.role !== "admin" && currentUserMember.role !== "owner")) {
       return NextResponse.json({ error: "Only Admins and Owners can modify workspace settings." }, { status: 403 });
    }

    const body = await req.json();
    const result = await workspaceService.updateWorkspace(params.id, body);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: String(result.error) }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const DELETE = withApiSetup({
  requireAuth: true,
  handler: async ({ user, params }) => {
    // strictly owner ONLY
    const { data: members } = await workspaceService.getWorkspaceMembers(params.id);
    const currentUserMember = members?.find(m => m.user_id === user!.id);
    
    if (!currentUserMember || currentUserMember.role !== "owner") {
       return NextResponse.json({ error: "Only the workspace Owner can delete the workspace." }, { status: 403 });
    }

    const result = await workspaceService.deleteWorkspace(params.id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: String(result.error) }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, message: "Workspace deleted successfully" });
  }
});
