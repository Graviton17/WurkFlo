"use client";

import { useState } from "react";
import {
  Timer,
  Play,
  CheckCircle2,
  Clock,
  Calendar,
  ChevronDown,
  ChevronRight,
  Circle,
  Plus,
} from "lucide-react";
import type { Sprint, Issue } from "@/types/index";

interface SprintsListProps {
  sprints: Sprint[];
  issues: Issue[];
  projectIdentifier?: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  active: {
    label: "Active",
    icon: <Play size={12} />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  planned: {
    label: "Planned",
    icon: <Clock size={12} />,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 size={12} />,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10 border-zinc-500/20",
  },
};

export function SprintsList({
  sprints,
  issues,
  projectIdentifier,
}: SprintsListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(sprints.filter((s) => s.status === "active").map((s) => s.id))
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (sprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#555] gap-3">
        <Timer size={40} className="text-[#333]" />
        <p className="text-[14px] font-medium text-[#777]">No sprints yet</p>
        <p className="text-[12px] text-[#555]">
          Create sprints to organize your work into time-boxed iterations
        </p>
      </div>
    );
  }

  // Sort: active first, then planned, then completed
  const sortOrder = { active: 0, planned: 1, completed: 2 };
  const sortedSprints = [...sprints].sort(
    (a, b) => (sortOrder[a.status] ?? 9) - (sortOrder[b.status] ?? 9)
  );

  return (
    <div className="space-y-3 p-6">
      {sortedSprints.map((sprint) => {
        const sprintIssues = issues.filter((i) => i.sprint_id === sprint.id);
        const config = STATUS_CONFIG[sprint.status] || STATUS_CONFIG.planned;
        const isExpanded = expandedIds.has(sprint.id);

        // Calculate progress for active sprints
        const doneIssues = sprintIssues.filter(
          (i) => i.state_id !== null
        ).length;
        const progress =
          sprintIssues.length > 0
            ? Math.round((doneIssues / sprintIssues.length) * 100)
            : 0;

        return (
          <div
            key={sprint.id}
            className="bg-[#0a0a0a]/50 backdrop-blur-md border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.12] transition-colors"
          >
            {/* Sprint Header */}
            <button
              onClick={() => toggleExpand(sprint.id)}
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
                <div className="flex items-center gap-2.5 mb-1">
                  <h3 className="text-[14px] font-semibold text-[#ddd] truncate group-hover:text-white transition-colors">
                    {sprint.name}
                  </h3>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.bg} ${config.color} uppercase tracking-wider`}
                  >
                    {config.icon}
                    {config.label}
                  </span>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 text-[11px] text-[#555]">
                  {sprint.start_date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(sprint.start_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {sprint.start_date && sprint.end_date && (
                    <span className="text-[#333]">→</span>
                  )}
                  {sprint.end_date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(sprint.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {/* Progress for active */}
                {sprint.status === "active" && sprintIssues.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#555] font-mono">
                      {progress}%
                    </span>
                  </div>
                )}
                <span className="text-[11px] text-[#555] font-mono bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.04]">
                  {sprintIssues.length} issues
                </span>
              </div>
            </button>

            {/* Expanded Issues */}
            {isExpanded && (
              <div className="border-t border-white/[0.04]">
                {sprintIssues.length === 0 ? (
                  <div className="px-5 py-6 text-[12px] text-[#555] text-center">
                    No issues in this sprint
                  </div>
                ) : (
                  sprintIssues.map((issue, idx) => {
                    const identifier = projectIdentifier
                      ? `${projectIdentifier}-${issue.sequence_id}`
                      : `#${issue.sequence_id}`;
                    return (
                      <div
                        key={issue.id}
                        className={`flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                          idx !== sprintIssues.length - 1
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
                        <span
                          className={`text-[10px] font-medium uppercase ${
                            issue.issue_type === "bug"
                              ? "text-red-400"
                              : "text-[#555]"
                          }`}
                        >
                          {issue.issue_type}
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
