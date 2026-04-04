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
    // Append a simple random string to the slug to prevent unique constraint violations
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    validatedData!.slug = `${validatedData!.slug}-${randomSuffix}`;

    const result = await workspaceService.createWorkspace(validatedData!, user!.id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }
});
