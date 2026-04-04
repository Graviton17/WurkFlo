import { NextResponse } from "next/server";
import { withApiSetup } from "@/lib/api-wrapper";
import { userService } from "@/services/index";
import { logger } from "@/lib/logger";

export const PATCH = withApiSetup({
  requireAuth: true,
  handler: async ({ req, user }) => {
    try {
      const body = await req.json();
      const { full_name, avatar_url } = body;

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Prepare partial update data safely
      const updateData: any = {};
      
      if (full_name !== undefined) {
         updateData.full_name = full_name.trim();
      }
      
      if (avatar_url !== undefined) {
         updateData.avatar_url = avatar_url;
      }

      if (Object.keys(updateData).length === 0) {
         return NextResponse.json({ success: true, message: "No changes detected." });
      }

      const { data, error } = await userService.updateUser(user.id, updateData);

      if (error || !data) {
        logger.error({ err: error, userId: user.id }, "Failed to update profile");
        return NextResponse.json({ success: false, error: "Failed to update profile." }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    } catch (err: any) {
      logger.error({ err }, "Profile API Error");
      return NextResponse.json(
        { success: false, error: err.message || "An unexpected error occurred." },
        { status: 500 }
      );
    }
  },
});
