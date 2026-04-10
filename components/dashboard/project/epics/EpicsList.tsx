"use client";

import { useState } from "react";
import {
  Milestone,
  ChevronDown,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Circle,
  Target,
} from "lucide-react";
import type { Epic, Issue } from "@/types/index";

interface EpicsListProps {
  epics: Epic[];
  issues: Issue[];
  projectIdentifier?: string;
}

export function EpicsList({ epics, issues, projectIdentifier }: EpicsListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (epics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#555] gap-3">
        <Milestone size={40} className="text-[#333]" />
        <p className="text-[14px] font-medium text-[#777]">No epics yet</p>
        <p className="text-[12px] text-[#555]">
          Create epics to group related issues into larger initiatives
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-6">
      {epics.map((epic) => {
        const epicIssues = issues.filter((i) => i.epic_id === epic.id);
        const doneCount = epicIssues.filter(
          (i) => i.state_id !== null
        ).length; // simplified — in real app check state category
        const progress =
          epicIssues.length > 0
            ? Math.round((doneCount / epicIssues.length) * 100)
            : 0;
        const isExpanded = expandedIds.has(epic.id);

        return (
          <div
            key={epic.id}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.1] transition-colors"
          >
            {/* Epic Header */}
            <button
              onClick={() => toggleExpand(epic.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left group"
            >
              <div className="shrink-0 text-[#555] group-hover:text-[#888] transition-colors">
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Target size={14} className="text-indigo-400 shrink-0" />
                  <h3 className="text-[14px] font-semibold text-[#ddd] truncate group-hover:text-white transition-colors">
                    {epic.name}
                  </h3>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-[200px] h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#555] font-mono">
                    {progress}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] text-[#555] font-mono bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.04]">
                  {epicIssues.length} issues
                </span>
                {epic.target_date && (
                  <span className="flex items-center gap-1.5 text-[11px] text-[#555]">
                    <Calendar size={11} />
                    {new Date(epic.target_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </button>

            {/* Expanded Issues */}
            {isExpanded && (
              <div className="border-t border-white/[0.04]">
                {epicIssues.length === 0 ? (
                  <div className="px-5 py-6 text-[12px] text-[#555] text-center">
                    No issues linked to this epic
                  </div>
                ) : (
                  epicIssues.map((issue, idx) => {
                    const identifier = projectIdentifier
                      ? `${projectIdentifier}-${issue.sequence_id}`
                      : `#${issue.sequence_id}`;
                    return (
                      <div
                        key={issue.id}
                        className={`flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors ${
                          idx !== epicIssues.length - 1
                            ? "border-b border-white/[0.03]"
                            : ""
                        }`}
                      >
                        <div className="pl-7">
                          <Circle size={13} className="text-[#444]" />
                        </div>
                        <span className="text-[11px] font-mono text-[#555] w-20">
                          {identifier}
                        </span>
                        <span className="text-[13px] text-[#bbb] flex-1 truncate">
                          {issue.title}
                        </span>
                        <span
                          className={`text-[10px] font-medium uppercase ${
                            issue.priority === "urgent"
                              ? "text-red-400"
                              : issue.priority === "high"
                                ? "text-orange-400"
                                : "text-[#555]"
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
