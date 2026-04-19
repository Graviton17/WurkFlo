import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { auth } from "@/lib/auth";
import { workspaceService, projectService } from "@/services/index";

export async function SidebarLayoutWrapper({
  children,
  activeWorkspaceId,
}: {
  children: React.ReactNode;
  activeWorkspaceId?: string;
}) {
  const user = await auth.getUser();
  const result = user
    ? await workspaceService.getAllWorkspacesByUserId(user.id)
    : { data: [] };
  const workspaces = result.data || [];

  let projects: any[] = [];
  let resolvedWorkspaceId = activeWorkspaceId;
  
  // If no workspace ID is provided, try to default to the first one available
  if (!resolvedWorkspaceId && workspaces.length > 0) {
    resolvedWorkspaceId = workspaces[0].id;
  }

  // Load projects for the active workspace
  if (resolvedWorkspaceId) {
    try {
      const projectsResult = await projectService.getProjectsByWorkspace(resolvedWorkspaceId);
      projects = projectsResult.data || [];
    } catch (err) {}
  }

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <AppSidebar
        workspaces={workspaces}
        activeWorkspaceId={resolvedWorkspaceId}
        projects={projects}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        {children}
      </main>
    </div>
  );
}
