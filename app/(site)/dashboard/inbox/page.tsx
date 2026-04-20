import { Inbox } from "lucide-react";
import { SidebarLayoutWrapper } from "@/components/dashboard/SidebarLayoutWrapper";
import { MyIssuesFeed } from "@/components/dashboard/inbox/MyIssuesFeed";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserWorkspacesAction } from "@/app/actions/workspace.actions";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const user = await auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const storedWorkspaceId = cookieStore.get("wurkflo_active_workspace_id")?.value;

  const result = await getUserWorkspacesAction();
  const workspaces = result.data || [];
  
  const activeWorkspaceId = storedWorkspaceId && workspaces.some(w => w.id === storedWorkspaceId)
    ? storedWorkspaceId
    : (workspaces.length > 0 ? workspaces[0].id : null);

  return (
    <SidebarLayoutWrapper activeWorkspaceId={activeWorkspaceId || undefined}>
      <div className="flex flex-col w-full h-full bg-[#0c0c0d] text-[#e5e7eb]">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/[0.06] shrink-0">
          <Inbox size={18} className="text-[#ff1f1f]/60" />
          <h1 className="text-[15px] font-semibold text-white tracking-tight">
            Inbox
          </h1>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-hidden">
          <MyIssuesFeed workspaceId={activeWorkspaceId} />
        </div>
      </div>
    </SidebarLayoutWrapper>
  );
}
