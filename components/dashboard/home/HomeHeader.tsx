"use client";

import { Home, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export function HomeHeader() {
  return (
    <PageHeader icon={<Home size={16} />} title="Home">
      <button className="flex items-center gap-2 text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 px-2.5 py-1.5 rounded-md transition-colors text-[0.8rem] border border-white/5">
        <Settings2 size={14} />
        <span>Manage widgets</span>
      </button>
    </PageHeader>
  );
}
