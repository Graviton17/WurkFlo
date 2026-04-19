"use client";

import { useState } from "react";
import {
  Milestone,
  ChevronDown,
  ChevronRight,
  Calendar,
  Target,
  Loader2,
  User,
} from "lucide-react";
import type { EpicWithProgress, IssueWithRelations } from "@/types/index";
import { getEpicIssues } from "@/app/actions/epic.actions";

interface EpicsListProps {
  epics: EpicWithProgress[];
  projectIdentifier?: string;
}

const STATE_DOT: Record<string, string> = {
  todo: "bg-zinc-400",
  in_progress: "bg-amber-400",
  done: "bg-emerald-400",
};

export function EpicsList({ epics, projectIdentifier }: EpicsListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [issueMap, setIssueMap] = useState<
    Record<string, IssueWithRelations[]>
  >({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggleExpand = async (epicId: string) => {
    if (expandedIds.has(epicId)) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(epicId);
        return next;
      });
      return;
    }

    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.add(epicId);
      return next;
    });

    // Fetch issues if not already loaded
    if (!issueMap[epicId]) {
      setLoadingId(epicId);
      const result = await getEpicIssues(epicId);
      if (result.success && result.data) {
        setIssueMap((prev) => ({ ...prev, [epicId]: result.data! }));
      }
      setLoadingId(null);
    }
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
        const progress =
          epic.total_issues > 0
            ? Math.round((epic.done_issues / epic.total_issues) * 100)
            : 0;
        const isExpanded = expandedIds.has(epic.id);
        const epicIssues = issueMap[epic.id] || [];
        const isLoading = loadingId === epic.id;

        return (
          <div
            key={epic.id}
            className="bg-[#0a0a0a]/50 backdrop-blur-md border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.12] transition-colors"
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
                  <Target size={14} className="text-[#ff1f1f]/80 shrink-0" />
                  <h3 className="text-[14px] font-semibold text-[#ddd] truncate group-hover:text-white transition-colors">
                    {epic.name}
                  </h3>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-[200px] h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff1f1f] to-[#ff1f1f]/60 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#555] font-mono">
                    {epic.done_issues}/{epic.total_issues} ({progress}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] text-[#555] font-mono bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.04]">
                  {epic.total_issues} issues
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
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2
                      size={18}
                      className="animate-spin text-[#555]"
                    />
                  </div>
                ) : epicIssues.length === 0 ? (
                  <div className="px-5 py-6 text-[12px] text-[#555] text-center">
                    No issues linked to this epic
                  </div>
                ) : (
                  epicIssues.map((issue, idx) => {
                    const identifier = projectIdentifier
                      ? `${projectIdentifier}-${issue.sequence_id}`
                      : `#${issue.sequence_id}`;
                    const stateCategory =
                      issue.workflow_state?.category || "todo";
                    const stateName = issue.workflow_state?.name || "—";
                    const stateDot =
                      STATE_DOT[stateCategory] || STATE_DOT.todo;

                    return (
                      <div
                        key={issue.id}
                        className={`flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                          idx !== epicIssues.length - 1
                            ? "border-b border-white/[0.03]"
                            : ""
                        }`}
                      >
                        <div className="pl-7">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${stateDot}`}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-[#555] w-20">
                          {identifier}
                        </span>
                        <span className="text-[13px] text-[#bbb] flex-1 truncate">
                          {issue.title}
                        </span>
                        {/* Workflow state badge */}
                        <span className="text-[10px] text-[#555] bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/[0.04]">
                          {stateName}
                        </span>
                        {/* Priority */}
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
                        {/* Issue type */}
                        <span
                          className={`text-[10px] font-medium uppercase ${
                            issue.issue_type === "bug"
                              ? "text-red-400"
                              : "text-[#555]"
                          }`}
                        >
                          {issue.issue_type}
                        </span>
                        {/* Assignee */}
                        <div className="w-5 h-5 shrink-0">
                          {issue.assignee ? (
                            <div
                              className="w-5 h-5 rounded-full bg-gradient-to-br from-[#333] to-[#222] border border-white/20 flex items-center justify-center text-[9px] font-bold text-white/70"
                              title={issue.assignee.full_name || ""}
                            >
                              {(
                                issue.assignee.full_name || "?"
                              )[0].toUpperCase()}
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-[#111] border border-white/20 ring-1 ring-white/10 flex items-center justify-center">
                              <User size={9} className="text-white/50" />
                            </div>
                          )}
                        </div>
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
