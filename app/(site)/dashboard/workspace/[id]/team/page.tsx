import { workspaceService } from "@/services/index";
import { TeamManagement } from "@/components/workspace/team-management";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { id: workspaceId } = await params;
  const result = await workspaceService.getWorkspaceMembersWithProfiles(workspaceId);

  if (!result.success) {
    return (
      <div className="flex h-full w-full flex-col items-center p-8 bg-[#0e0e10]">
        <h1 className="text-2xl font-semibold tracking-tight text-[#ec7c8a]">Team Configuration Error</h1>
        <p className="mt-2 text-[#acaab1]">Failed to load workspace members. Are you sure you have access to this workspace?</p>
      </div>
    );
  }

  // Pre-hydrated payload for the client
  const members = result.data || [];

  return (
    <div className="w-full min-h-screen bg-[#0e0e10] p-8 md:p-12 lg:p-16">
      <TeamManagement workspaceId={workspaceId} initialMembers={members} />
    </div>
  );
}
