import { NextRequest, NextResponse } from "next/server";
import { sprintService } from "@/services/index";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const result = await sprintService.getSprintById(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message },
        { status: 404 },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const result = await sprintService.updateSprint(id, body);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const result = await sprintService.deleteSprint(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error?.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: "Sprint deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
