import { NextRequest, NextResponse } from "next/server";
import { issueService } from "@/services/index";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let result;
    if (projectId) {
      result = await issueService.getIssuesByProject(projectId);
    } else {
      result = await issueService.getIssuesByProject("");
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error?.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await issueService.createIssue(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error?.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
