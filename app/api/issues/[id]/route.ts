import { NextRequest, NextResponse } from "next/server";
import { issueService } from "@/services/index";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const result = await issueService.getIssueById(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error?.message },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const result = await issueService.updateIssue(id, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error?.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH delegates to PUT logic for partial updates
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return PUT(request, context);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const result = await issueService.deleteIssue(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error?.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, message: "Issue deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
