"use client";

import Link from "next/link";
import { ChevronDown, Search, Inbox, HelpCircle } from "lucide-react";

interface TopNavbarProps {
  workspaceSlug: string;
}

export function TopNavbar({ workspaceSlug }: TopNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-[52px] border-b border-white/[0.07] bg-[#131316] flex items-center justify-between px-3 z-50">

      {/* Left: Workspace Switcher */}
      <div className="flex items-center">
        <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-md transition-colors text-left">
          <div className="w-5 h-5 rounded bg-[#3c00ff] text-white flex items-center justify-center text-xs font-bold leading-none shrink-0">
            {workspaceSlug.charAt(0).toUpperCase()}
          </div>
          <span className="text-[0.9rem] font-medium text-[#f0f0f0]">
            {workspaceSlug}
          </span>
          <ChevronDown size={14} className="text-[#888] shrink-0" />
        </button>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-[500px] px-8">
        <div className="relative flex items-center w-full">
          <Search size={14} className="absolute left-3 text-[#888]" />
          <input
            type="text"
            placeholder="Search"
            className="h-8 w-full bg-white/[0.04] border border-white/5 hover:border-white/10 focus:border-white/20 focus:bg-white/[0.06] rounded-md pl-8 pr-3 text-[0.85rem] text-white placeholder:text-[#888] outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${workspaceSlug}/get-started`}
          className="text-[0.8rem] font-medium text-[#f0f0f0] border border-white/10 hover:bg-white/5 px-2.5 py-1 rounded-md transition-colors hidden sm:block"
        >
          Get Started
        </Link>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 rounded-md transition-colors">
            <Inbox size={16} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 rounded-md transition-colors">
            <HelpCircle size={16} />
          </button>
        </div>
        <button className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[0.7rem] font-medium ml-1">
          H
        </button>
      </div>

    </header>
  );
}
