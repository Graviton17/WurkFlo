import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/services/index";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    
    let result;
    if (workspaceId) {
      result = await projectService.getProjectsByWorkspace(workspaceId);
    } else {
      // In a real app we might reject this if workspaceId is strictly required
      // or fetch all projects the user has access to. For base CRUD:
      result = await projectService.getProjectsByWorkspace(''); 
    }
    
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
    const body = await request.json();
    const result = await projectService.createProject(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
