"use client";

import { useState, useEffect } from "react";
import { User, AlertCircle, GripVertical, Search, Filter } from "lucide-react";
import type { Issue } from "@/types/index";

interface BacklogListProps {
  issues: Issue[];
  projectIdentifier?: string;
  onIssueClick?: (issue: Issue) => void;
}

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-amber-400",
  low: "bg-zinc-500",
};

export function BacklogList({
  issues,
  projectIdentifier,
  onIssueClick,
}: BacklogListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = issues.filter((issue) =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-white/[0.04] shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter issues..."
            className="w-full bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] focus:border-white/20 focus:ring-1 focus:ring-white/10 rounded-lg pl-9 pr-3 py-[7px] text-[12.5px] text-[#ccc] placeholder:text-[#444] outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-1.5 text-[12px] text-[#666] hover:text-[#aaa] bg-white/[0.03] hover:bg-white/[0.06] px-3 py-[7px] rounded-lg border border-white/[0.06] transition-all">
          <Filter size={13} />
          Filter
        </button>
      </div>

      {/* Table Header */}
      <div className="flex items-center px-6 py-2 text-[10px] font-semibold text-[#444] uppercase tracking-widest border-b border-white/[0.04] shrink-0">
        <div className="w-8" />
        <div className="w-24">ID</div>
        <div className="flex-1">Title</div>
        <div className="w-20 text-center">Priority</div>
        <div className="w-16 text-center">Points</div>
        <div className="w-20 text-center">Type</div>
        <div className="w-16 text-center">Assignee</div>
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#555] gap-2">
            <AlertCircle size={24} className="text-[#333]" />
            <p className="text-[13px]">
              {searchQuery ? "No matching issues" : "Backlog is empty"}
            </p>
            <p className="text-[11px] text-[#444]">
              {searchQuery
                ? "Try a different search"
                : "Issues without a sprint will appear here"}
            </p>
          </div>
        ) : (
          filtered.map((issue, idx) => {
            const identifier = projectIdentifier
              ? `${projectIdentifier}-${issue.sequence_id}`
              : `#${issue.sequence_id}`;

            return (
              <div
                key={issue.id}
                onClick={() => onIssueClick?.(issue)}
                className={`flex items-center px-6 py-3 cursor-pointer transition-colors hover:bg-white/[0.02] group ${
                  idx !== filtered.length - 1
                    ? "border-b border-white/[0.03]"
                    : ""
                }`}
              >
                <div className="w-8 flex items-center">
                  <GripVertical
                    size={14}
                    className="text-[#333] group-hover:text-[#555] transition-colors cursor-grab"
                  />
                </div>
                <div className="w-24">
                  <span className="text-[11px] font-mono text-[#555]">
                    {identifier}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] text-[#ccc] group-hover:text-white font-medium truncate block transition-colors">
                    {issue.title}
                  </span>
                </div>
                <div className="w-20 flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      PRIORITY_DOT[issue.priority] || PRIORITY_DOT.medium
                    }`}
                    title={issue.priority}
                  />
                </div>
                <div className="w-16 text-center text-[11px] font-mono text-[#555]">
                  {issue.estimate || "—"}
                </div>
                <div className="w-20 text-center">
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wider ${
                      issue.issue_type === "bug"
                        ? "text-red-400"
                        : issue.issue_type === "story"
                          ? "text-purple-400"
                          : "text-[#666]"
                    }`}
                  >
                    {issue.issue_type}
                  </span>
                </div>
                <div className="w-16 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#111] border border-white/20 ring-1 ring-white/10 flex items-center justify-center">
                    <User size={10} className="text-white/70" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
