import { NextRequest, NextResponse } from "next/server";
import { workspaceService } from "@/services/index";
import { createServerComponentClient } from "@/services/server.service";

export async function GET(request: NextRequest) {
  try {
    const result = await workspaceService.getAllWorkspaces();
    
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ data: result.data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = await workspaceService.createWorkspace(body);
    
    if (!result.success || !result.data) {
      return NextResponse.json({ error: result.error?.message }, { status: 400 });
    }
    
    // Make the creator the owner of the workspace
    await workspaceService.addMember(result.data.id, user.id, "owner");

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
