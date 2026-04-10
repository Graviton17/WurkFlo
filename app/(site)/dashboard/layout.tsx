import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { auth } from "@/lib/auth";
import { workspaceService } from "@/services/index";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth.getUser();
  const result = user
    ? await workspaceService.getAllWorkspacesByUserId(user.id)
    : { data: [] };
  const workspaces = result.data || [];
  const activeWorkspaceId = workspaces.length > 0 ? workspaces[0].id : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#111113]">
      <DashboardNavbar initialUser={user} workspaces={workspaces} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
      <CommandPalette workspaceId={activeWorkspaceId} />
    </div>
  );
}
