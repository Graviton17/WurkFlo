import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { auth } from "@/lib/auth";
import { workspaceService, projectService } from "@/services/index";

export async function SidebarLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth.getUser();
  const result = user
    ? await workspaceService.getAllWorkspacesByUserId(user.id)
    : { data: [] };
  const workspaces = result.data || [];

  // Get the first workspace's projects for the sidebar
  let projects: any[] = [];
  let activeWorkspaceId: string | null = null;
  if (workspaces.length > 0) {
    activeWorkspaceId = workspaces[0].id;
    try {
      const projectsResult = await projectService.getProjectsByWorkspace(
        workspaces[0].id
      );
      projects = projectsResult.data || [];
    } catch (err) {}
  }

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <AppSidebar
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        projects={projects}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        {children}
      </main>
    </div>
  );
}
