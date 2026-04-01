"use client";

import { FileText, Link as LinkIcon, Activity } from "lucide-react";

export function QuicklinksSection() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-[#f0f0f0] font-medium text-[0.95rem]">Quicklinks</h2>
        <button className="text-cyan-500 hover:text-cyan-400 text-[0.8rem] font-medium transition-colors">
          + Add quick Link
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1 */}
        <div className="bg-[#222226] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-3 flex items-start gap-3 cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[#888] group-hover:text-[#f0f0f0] transition-colors shrink-0">
            <Activity size={16} />
          </div>
          <div className="flex flex-col items-start pt-0.5">
            <span className="text-[0.85rem] font-medium text-[#f0f0f0]">Plane Changelog</span>
            <span className="text-[0.7rem] text-[#888] mt-0.5">2 days ago</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#222226] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-3 flex items-start gap-3 cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[#888] group-hover:text-[#f0f0f0] transition-colors shrink-0">
            <FileText size={16} />
          </div>
          <div className="flex flex-col items-start pt-0.5">
            <span className="text-[0.85rem] font-medium text-[#f0f0f0]">Plane Docs</span>
            <span className="text-[0.7rem] text-[#888] mt-0.5">2 days ago</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#222226] border border-white/[0.07] hover:border-white/[0.12] rounded-lg p-3 flex items-start gap-3 cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[#888] group-hover:text-[#f0f0f0] transition-colors shrink-0">
            <LinkIcon size={16} />
          </div>
          <div className="flex flex-col items-start pt-0.5">
            <span className="text-[0.85rem] font-medium text-[#f0f0f0]">Plane Blogs</span>
            <span className="text-[0.7rem] text-[#888] mt-0.5">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
