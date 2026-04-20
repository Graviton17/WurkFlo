import { MyIssuesList } from "@/components/dashboard/my-issues/MyIssuesList";
import { ListChecks } from "lucide-react";
import { SidebarLayoutWrapper } from "@/components/dashboard/SidebarLayoutWrapper";
import { auth } from "@/lib/auth";
import { workspaceService } from "@/services/index";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function MyIssuesPage() {
  const user = await auth.getUser();
  if (!user) redirect("/login");

  const cookieStore = await cookies();
  const storedWorkspaceId = cookieStore.get("wurkflo_active_workspace_id")?.value;

  const result = await workspaceService.getAllWorkspacesByUserId(user.id);
  const workspaces = result.data || [];
  
  // Verify stored ID is valid, otherwise fallback to first workspace
  const activeWorkspaceId = storedWorkspaceId && workspaces.some(w => w.id === storedWorkspaceId)
    ? storedWorkspaceId
    : (workspaces.length > 0 ? workspaces[0].id : null);

  return (
    <SidebarLayoutWrapper activeWorkspaceId={activeWorkspaceId || undefined}>
      <div className="flex flex-col w-full h-full bg-[#0c0c0d] text-[#e5e7eb]">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/[0.06] shrink-0">
          <ListChecks size={18} className="text-[#ff1f1f]/60" />
          <h1 className="text-[15px] font-semibold text-white tracking-tight">
            My Issues
          </h1>
        </div>

        {/* Issues List */}
        <div className="flex-1 overflow-y-auto">
          {activeWorkspaceId ? (
            <MyIssuesList workspaceId={activeWorkspaceId} />
          ) : (
            <div className="flex items-center justify-center h-full text-[#555] p-6 text-sm">
              No workspaces found.
            </div>
          )}
        </div>
      </div>
    </SidebarLayoutWrapper>
  );
}
