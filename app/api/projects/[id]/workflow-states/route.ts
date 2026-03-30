import { NextRequest, NextResponse } from "next/server";
import { workflowStateService } from "@/services/index";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // id refers to project_id here
) {
  try {
    const projectId = (await params).id;
    const result = await workflowStateService.getStatesByProject(projectId);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ data: result.data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // id refers to project_id here
) {
  try {
    const projectId = (await params).id;
    const body = await request.json();
    
    // Automatically attach the project ID to the payload
    const payload = { ...body, project_id: projectId };
    
    const result = await workflowStateService.createState(payload);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
