import { workspaceService } from "@/services/index";
import { WorkspaceSettings } from "@/components/workspace/workspace-settings";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { id: workspaceId } = await params;
  const result = await workspaceService.getWorkspaceById(workspaceId);

  if (!result.success || !result.data) {
    return (
      <div className="flex h-full w-full flex-col items-center p-8 bg-[#0e0e10]">
        <h1 className="text-2xl font-semibold tracking-tight text-[#ec7c8a]">Access Denied</h1>
        <p className="mt-2 text-[#acaab1]">Workspace not found or unauthorized access.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0e0e10] p-8 md:p-12 lg:p-16">
      <WorkspaceSettings workspace={result.data} />
    </div>
  );
}
