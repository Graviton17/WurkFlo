"use client";

import { Search } from "lucide-react";

interface ProjectSearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export function ProjectSearchBar({ value, onChange }: ProjectSearchBarProps) {
  return (
    <div className="relative max-w-sm flex-1">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
      <input
        type="text"
        placeholder="Search projects..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.03] border border-white/10 text-white rounded-xl py-2 pr-3 pl-10 outline-none transition-all duration-200 text-[13px] focus:border-white/20 focus:ring-2 focus:ring-white/10 focus:bg-white/[0.05] placeholder:text-white/30"
      />
    </div>
  );
}
