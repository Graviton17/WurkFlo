import { NextResponse } from "next/server";
import { withApiSetup } from "@/lib/api-wrapper";
import { userService, onboardingService } from "@/services/index";

export const GET = withApiSetup({
  requireAuth: true,
  handler: async ({ user }) => {
    try {
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      // Check if user belongs to any workspace
      const { data: memberData } = await onboardingService.getMemberWorkspace(user.id);

      const hasWorkspace = !!memberData?.workspace_id;

      // Fetch user profile stats
      const { data: userData } = await onboardingService.getUserProfile(user.id);

      return NextResponse.json({ 
        success: true, 
        hasWorkspace, 
        fullName: userData?.full_name || "",
        userId: user.id
      });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }
});

export const POST = withApiSetup({
  requireAuth: true,
  handler: async ({ req, user }) => {
    try {
      const body = await req.json();
      const { fullName, workspaceData, membersData, projectData } = body;

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Update user full name
      if (fullName?.trim()) {
        await userService.updateUser(user.id, { full_name: fullName.trim() });
      }

      if (!workspaceData) {
        return NextResponse.json({ success: true });
      }


      const { data: workspaceId, error: rpcError } = await onboardingService.createWorkspaceAndProject(
        workspaceData,
        projectData,
        user.id
      );

      if (rpcError) {
        return NextResponse.json({ success: false, error: rpcError.message }, { status: 400 });
      }

      // Add Members
      await onboardingService.addMembers(workspaceId, membersData);

      return NextResponse.json({ success: true, data: { workspaceId } });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Failed to process onboarding" },
        { status: 500 }
      );
    }
  },
});
