import { NextResponse } from "next/server";
import { withApiSetup } from "@/lib/api-wrapper";
import { workspaceService, userService } from "@/services/index";
import { logger } from "@/lib/logger";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const POST = withApiSetup({
  requireAuth: true,
  handler: async ({ req, user, params }) => {
    try {
      const { id } = params;
      const { email, role } = await req.json();

      if (!email || !role) {
        return NextResponse.json({ error: "Email and role are required." }, { status: 400 });
      }

      // Check if user is authorized to invite (must be admin or owner)
      const { data: members } = await workspaceService.getWorkspaceMembers(id);
      const currentUserMember = members?.find(m => m.user_id === user!.id);
      
      if (!currentUserMember || (currentUserMember.role !== "admin" && currentUserMember.role !== "owner")) {
         return NextResponse.json({ error: "You do not have permission to invite users." }, { status: 403 });
      }

      // Find the user by email via userService
      const { data: targetUser } = await userService.getUserByEmail(email);

      let added = false;

      if (targetUser) {
         // User exists, add them to workspace
         const addResult = await workspaceService.addMember(id, targetUser.id, role);
         if (addResult.success) {
            added = true;
         } else if (String(addResult.error).includes('duplicate key')) {
            return NextResponse.json({ error: "User is already in this workspace." }, { status: 400 });
         } else {
            throw new Error(String(addResult.error) || "Failed to add member");
         }
      }

      // Send the email via Resend
      if (resend) {
         const workspaceRes = await workspaceService.getWorkspaceById(id);
         const workspaceName = workspaceRes.data?.name || "a workspace";
         
         const joinUrl = targetUser ? `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/workspace/${id}` : `${process.env.NEXT_PUBLIC_BASE_URL}/signup`;

         await resend.emails.send({
           from: "WurkFlo <invites@resend.dev>", // Using Resend testing domain
           to: email,
           subject: `You have been invited to ${workspaceName} on WurkFlo`,
           html: `
             <div style="font-family: sans-serif; padding: 20px;">
                <h2>Welcome to WurkFlo!</h2>
                <p>You have been invited to collaborate in <strong>${workspaceName}</strong> as a ${role}.</p>
                <p>Click the link below to access your workspace:</p>
                <a href="${joinUrl}" style="display:inline-block; padding:10px 20px; background-color:#10b981; color:white; text-decoration:none; border-radius:5px;">Join Workspace</a>
             </div>
           `
         });
      } else {
         logger.warn("RESEND_API_KEY is not configured. Invitation email was not actually sent.");
      }

      if (!targetUser) {
         return NextResponse.json({ success: true, message: "Invitation email sent! The user must create an account before they appear in your active team directory." });
      }

      return NextResponse.json({ success: true, message: "User added and email sent." });
    } catch (err: any) {
      logger.error({ err }, "Invite Member API Error");
      return NextResponse.json(
        { success: false, error: err.message || "An unexpected error occurred." },
        { status: 500 }
      );
    }
  },
});

export const PATCH = withApiSetup({
  requireAuth: true,
  handler: async ({ req, user, params }) => {
    try {
      const { id } = params;
      const { userId, role } = await req.json();

      // Check auth
      const { data: members } = await workspaceService.getWorkspaceMembers(id);
      const currentUserMember = members?.find(m => m.user_id === user!.id);
      if (!currentUserMember || (currentUserMember.role !== "admin" && currentUserMember.role !== "owner")) {
         return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
      }

      // Update role
      const updateResult = await workspaceService.updateMemberRole(id, userId, role);

      if (!updateResult.success) throw new Error(String(updateResult.error));
      
      return NextResponse.json({ success: true });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
});

export const DELETE = withApiSetup({
  requireAuth: true,
  handler: async ({ req, user, params }) => {
    try {
      const { id } = params;
      const url = new URL(req.url);
      const targetUserId = url.searchParams.get("userId");

      if (!targetUserId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

      // Check auth
      const { data: members } = await workspaceService.getWorkspaceMembers(id);
      const currentUserMember = members?.find(m => m.user_id === user!.id);
      if (!currentUserMember || (currentUserMember.role !== "admin" && currentUserMember.role !== "owner")) {
         return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
      }

      await workspaceService.removeMember(id, targetUserId);
      return NextResponse.json({ success: true });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
});
