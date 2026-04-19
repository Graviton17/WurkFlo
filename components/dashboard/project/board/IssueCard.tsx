"use client";

import { User, AlertCircle } from "lucide-react";
import type { IssueWithRelations } from "@/types/index";

interface IssueCardProps {
  issue: IssueWithRelations;
  projectIdentifier?: string;
  onClick?: (issue: IssueWithRelations) => void;
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  urgent: {
    label: "Urgent",
    color:
      "bg-red-500/10 text-red-400 border border-red-500/20",
  },
  high: {
    label: "High",
    color:
      "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  },
  medium: {
    label: "Medium",
    color:
      "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  },
  low: {
    label: "Low",
    color: "bg-zinc-700/30 text-zinc-400 border border-zinc-700/40",
  },
};

export function IssueCard({
  issue,
  projectIdentifier,
  onClick,
}: IssueCardProps) {
  const priority = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.medium;
  const identifier = projectIdentifier
    ? `${projectIdentifier}-${issue.sequence_id}`
    : `#${issue.sequence_id}`;

  const assignee = issue.assignee;
  const initials = assignee?.full_name
    ? assignee.full_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  return (
    <div
      onClick={() => onClick?.(issue)}
      className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-3.5 cursor-pointer transition-all duration-200 group hover:shadow-lg hover:shadow-black/20 active:scale-[0.98]"
    >
      {/* Top: Identifier + Type */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono text-[#555] group-hover:text-[#777] transition-colors">
          {identifier}
        </span>
        {issue.issue_type === "bug" && (
          <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/15">
            <AlertCircle size={10} />
            Bug
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-[13px] font-medium text-[#ddd] leading-snug mb-3 line-clamp-2 group-hover:text-white transition-colors">
        {issue.title}
      </h4>

      {/* Bottom: Priority + Estimate + Assignee */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${priority.color}`}
          >
            {priority.label}
          </span>
          {issue.estimate && (
            <span className="text-[10px] text-[#555] bg-white/[0.04] px-1.5 py-0.5 rounded-full border border-white/[0.04] font-mono">
              {issue.estimate}pt
            </span>
          )}
        </div>
        {/* Assignee avatar */}
        {assignee && initials ? (
          <div
            className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border border-white/20 ring-1 ring-white/10"
            title={assignee.full_name || ""}
          >
            <span className="text-[9px] font-bold text-white/80">
              {initials}
            </span>
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#111] flex items-center justify-center border border-white/20 ring-1 ring-white/10">
            <User size={12} className="text-white/50" />
          </div>
        )}
      </div>
    </div>
  );
}
