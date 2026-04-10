"use client";

import { Inbox, Bell, Check } from "lucide-react";

export function InboxFeed() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-[#555] gap-4 px-6">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
        <Inbox size={28} className="text-[#444]" />
      </div>
      <div className="text-center max-w-sm">
        <h2 className="text-[16px] font-semibold text-[#999] mb-1.5">
          You&apos;re all caught up
        </h2>
        <p className="text-[13px] text-[#555] leading-relaxed">
          Notifications about issues you&apos;re assigned to or following will
          appear here.
        </p>
      </div>
    </div>
  );
}
