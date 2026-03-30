import { NextRequest, NextResponse } from "next/server";
import { workflowStateService } from "@/services/index";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const result = await workflowStateService.getStateById(id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 404 });
    }
    
    return NextResponse.json({ data: result.data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const result = await workflowStateService.updateState(id, body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ data: result.data });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const result = await workflowStateService.deleteState(id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ message: "Workflow state deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
