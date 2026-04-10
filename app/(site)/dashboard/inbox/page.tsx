import { Inbox } from "lucide-react";
import { SidebarLayoutWrapper } from "@/components/dashboard/SidebarLayoutWrapper";
import { MyIssuesFeed } from "@/components/dashboard/inbox/MyIssuesFeed";
import { auth } from "@/lib/auth";
import { workspaceService } from "@/services/index";

export default async function InboxPage() {
  const user = await auth.getUser();
  let activeWorkspaceId: string | null = null;

  if (user) {
    const result = await workspaceService.getAllWorkspacesByUserId(user.id);
    const workspaces = result.data || [];
    if (workspaces.length > 0) {
      activeWorkspaceId = workspaces[0].id;
    }
  }

  return (
    <SidebarLayoutWrapper>
      <div className="flex flex-col w-full h-full bg-[#111113] text-[#e5e7eb]">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-white/[0.06] shrink-0">
          <Inbox size={18} className="text-[#666]" />
          <h1 className="text-[15px] font-semibold text-[#ddd] tracking-tight">
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
