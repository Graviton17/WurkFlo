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
            <Inbox size={15} className="text-[#777]" />
          </div>
          <div>
            <h1 className="text-[14px] font-semibold text-white/85 tracking-tight leading-none">
              Inbox
            </h1>
            <p className="text-[11px] text-[#444] mt-0.5">
              Activity and notifications
            </p>
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-hidden">
          <MyIssuesFeed workspaceId={activeWorkspaceId} />
        </div>
      </div>
    </SidebarLayoutWrapper>
  );
}
