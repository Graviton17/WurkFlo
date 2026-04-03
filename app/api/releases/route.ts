import { NextRequest, NextResponse } from "next/server";
import { releaseService } from "@/services/index";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let result;
    if (projectId) {
      result = await releaseService.getReleasesByProject(projectId);
    } else {
      result = await releaseService.getReleasesByProject("");
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ data: result.data });
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
    const result = await releaseService.createRelease(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
