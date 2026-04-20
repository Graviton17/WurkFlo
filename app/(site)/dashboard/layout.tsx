import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserWorkspacesAction } from "@/app/actions/workspace.actions";
import { getUserProfileAction } from "@/app/actions/user.actions";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [workspaceResult, profileResult] = await Promise.all([
    getUserWorkspacesAction(),
    getUserProfileAction()
  ]);
  
  const cookieStore = await cookies();
  const storedWorkspaceId = cookieStore.get("wurkflo_active_workspace_id")?.value;

  const workspaces = workspaceResult.data || [];
  const activeWorkspaceId = storedWorkspaceId && workspaces.some(w => w.id === storedWorkspaceId)
    ? storedWorkspaceId
    : (workspaces.length > 0 ? workspaces[0].id : null);
  const userProfile = profileResult.success ? profileResult.data : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0c0d]">
      <DashboardNavbar initialUser={user} userProfile={userProfile} workspaces={workspaces} defaultWorkspaceId={activeWorkspaceId} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
      <CommandPalette workspaceId={activeWorkspaceId} />
    </div>
  );
}
