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
  const activeWorkspaceId =
    storedWorkspaceId && workspaces.some((w) => w.id === storedWorkspaceId)
      ? storedWorkspaceId
      : workspaces.length > 0
        ? workspaces[0].id
        : null;

  return (
    <SidebarLayoutWrapper activeWorkspaceId={activeWorkspaceId || undefined}>
      <div className="flex flex-col w-full h-full bg-[#0c0c0d] text-[#e5e7eb]">
        {/* Page Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] bg-[#0c0c0d]/90 backdrop-blur-md shrink-0">
          <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
            <ListChecks size={15} className="text-[#777]" />
          </div>
          <div>
            <h1 className="text-[14px] font-semibold text-white/85 tracking-tight leading-none">
              My Issues
            </h1>
            <p className="text-[11px] text-[#444] mt-0.5">
              Issues assigned to you
            </p>
          </div>
        </div>

        {/* Issues List */}
        <div className="flex-1 overflow-y-auto">
          {activeWorkspaceId ? (
            <MyIssuesList workspaceId={activeWorkspaceId} />
          ) : (
            <div className="flex items-center justify-center h-full text-[#444] p-6 text-sm">
              No workspaces found.
            </div>
          )}
        </div>
      </div>
    </SidebarLayoutWrapper>
  );
}
