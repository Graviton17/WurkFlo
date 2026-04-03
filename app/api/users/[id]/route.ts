import { NextResponse } from "next/server";
import { userService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";

export const GET = withApiSetup({
  requireAuth: true,
  handler: async ({ params }) => {
    const result = await userService.getUserById(params.id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const PUT = withApiSetup({
  requireAuth: true,
  // Skipping strict schema here to allow partial updates, but ideally we add an UpdateUserSchema
  handler: async ({ req, params, user }) => {
    if (user!.id !== params.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = await userService.upsertUser({ 
      id: params.id, 
      email: user!.email,
      ...body 
    });
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const DELETE = withApiSetup({
  requireAuth: true,
  handler: async ({ params, user }) => {
    if (user!.id !== params.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const result = await userService.deleteUser(params.id);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  }
});
