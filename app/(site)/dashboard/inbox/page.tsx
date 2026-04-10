import { InboxFeed } from "@/components/dashboard/inbox/InboxFeed";
import { Inbox } from "lucide-react";
import { SidebarLayoutWrapper } from "@/components/dashboard/SidebarLayoutWrapper";

export default function InboxPage() {
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
        <div className="flex-1">
          <InboxFeed />
        </div>
      </div>
    </SidebarLayoutWrapper>
  );
}
