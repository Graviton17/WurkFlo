import { NextResponse } from "next/server";
import { workspaceService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";
import { AddWorkspaceMemberSchema } from "@/types/validation";

export const GET = withApiSetup({
  requireAuth: true,
  handler: async ({ params }) => {
    const result = await workspaceService.getWorkspaceMembers(params.id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const POST = withApiSetup({
  requireAuth: true,
  schema: AddWorkspaceMemberSchema,
  handler: async ({ params, validatedData }) => {
    const { userId, role } = validatedData!;
    const result = await workspaceService.addMember(params.id, userId, role);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }
});
