"use client";

import { ChevronDown, Sparkles } from "lucide-react";

export function RecentsSection() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-[#f0f0f0] font-medium text-[0.95rem]">Recents</h2>
        
        {/* Simple native styling for dropdown, or basic button if Shadcn dropdown missing */}
        <button className="flex items-center gap-1.5 text-[0.8rem] text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 px-2 py-1 rounded transition-colors border border-transparent">
          <span>All</span>
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-1 mt-2">
        {/* Exact Match List Item */}
        <div className="flex items-center justify-between py-2 px-1 hover:bg-white/5 rounded-md cursor-pointer transition-colors group">
          <div className="flex items-center gap-4">
            {/* Plane logo placeholder */}
            <div className="w-[18px] h-[18px] flex items-center justify-center text-amber-500 shrink-0">
              <Sparkles size={14} />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[0.75rem] font-medium text-[#888] tracking-widest uppercase">HARSH</span>
              <span className="text-[0.85rem] font-medium text-[#f0f0f0]">Harshi</span>
              <span className="text-[0.8rem] text-[#888]">12 minutes ago</span>
            </div>
          </div>

          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-700 text-white text-[0.6rem] font-bold border border-[#1a1a1a] group-hover:border-[#222226] transition-colors shadow-sm shrink-0">
            H
          </div>
        </div>
      </div>
    </div>
  );
}
