import { NextResponse } from "next/server";
import { workspaceService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";
import { CreateWorkspaceSchema } from "@/types/validation";

export const GET = withApiSetup({
  requireAuth: true,
  handler: async ({ user }) => {
    // Only fetch workspaces that the authenticated user is a member of
    const result = await workspaceService.getAllWorkspacesByUserId(user!.id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const POST = withApiSetup({
  requireAuth: true,
  schema: CreateWorkspaceSchema,
  handler: async ({ user, validatedData }) => {
    const result = await workspaceService.createWorkspace(validatedData!);
    
    if (!result.success || !result.data) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    // We will refactor this to an RPC later in Phase II
    const memberResult = await workspaceService.addMember(result.data.id, user!.id, "owner");

    if (!memberResult.success) {
      await workspaceService.deleteWorkspace(result.data.id);
      return NextResponse.json(
        { success: false, error: "Failed to create workspace" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }
});
