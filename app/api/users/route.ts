import { NextResponse } from "next/server";
import { userService } from "@/services/index";
import { withApiSetup } from "@/lib/api-wrapper";
import { CreateUserSchema } from "@/types/validation";

export const GET = withApiSetup({
  requireAuth: true,
  handler: async () => {
    const result = await userService.getAllUsers();
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data });
  }
});

export const POST = withApiSetup({
  requireAuth: true,
  schema: CreateUserSchema,
  handler: async ({ validatedData }) => {
    // validatedData is guaranteed to exist here due to schema check
    const result = await userService.createUser(validatedData!);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error?.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }
});
