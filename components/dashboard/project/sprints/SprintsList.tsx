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
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import type { Sprint, IssueWithRelations } from "@/types/index";
import { SprintBurndownChart } from "./SprintBurndownChart";

interface SprintsListProps {
  sprints: Sprint[];
  issues: IssueWithRelations[];
  projectIdentifier?: string;
  hasActiveSprint: boolean;
  onStartSprint?: (sprintId: string) => void;
  onCompleteSprint?: (sprint: Sprint) => void;
  onDeleteSprint?: (sprintId: string) => void;
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
  hasActiveSprint,
  onStartSprint,
  onCompleteSprint,
  onDeleteSprint,
}: SprintsListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(sprints.filter((s) => s.status === "active").map((s) => s.id))
  );
  const [warningModal, setWarningModal] = useState(false);

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

  const handleStartClick = (sprintId: string) => {
    if (hasActiveSprint) {
      setWarningModal(true);
    } else {
      onStartSprint?.(sprintId);
    }
  };

  return (
    <>
      <div className="space-y-3 p-6">
        {sortedSprints.map((sprint) => {
          const sprintIssues = issues.filter((i) => i.sprint_id === sprint.id);
          const config = STATUS_CONFIG[sprint.status] || STATUS_CONFIG.planned;
          const isExpanded = expandedIds.has(sprint.id);

          // Fixed progress: use workflow_state.category === "done"
          const doneIssues = sprintIssues.filter(
            (i) => i.workflow_state?.category === "done"
          ).length;
          const progress =
            sprintIssues.length > 0
              ? Math.round((doneIssues / sprintIssues.length) * 100)
              : 0;

          // Velocity: sum of story points for completed issues
          const completedPoints = sprintIssues
            .filter((i) => i.workflow_state?.category === "done")
            .reduce((sum, i) => sum + (i.estimate || 0), 0);

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

                <div className="flex items-center gap-3 shrink-0">
                  {/* Progress bar */}
                  {(sprint.status === "active" || sprint.status === "completed") &&
                    sprintIssues.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              sprint.status === "completed"
                                ? "bg-gradient-to-r from-zinc-500 to-zinc-400"
                                : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                            }`}
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

              {/* Action Buttons */}
              <div className="flex items-center gap-2 px-5 pb-3 -mt-1">
                {sprint.status === "planned" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartClick(sprint.id);
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/[0.08] hover:bg-emerald-500/[0.15] px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all"
                    >
                      <Play size={12} />
                      Start Sprint
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSprint?.(sprint.id);
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-medium text-[#666] hover:text-red-400 bg-white/[0.03] hover:bg-red-500/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-red-500/20 transition-all"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </>
                )}
                {sprint.status === "active" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompleteSprint?.(sprint);
                    }}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-500/[0.08] hover:bg-amber-500/[0.15] px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all"
                  >
                    <CheckCircle2 size={12} />
                    Complete Sprint
                  </button>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-white/[0.04]">
                  {/* Sprint progress summary (active + completed) */}
                  {(sprint.status === "active" || sprint.status === "completed") && (
                    <div className="px-5 py-3 border-b border-white/[0.04] bg-white/[0.01]">
                      <div className="flex items-center gap-6 text-[11px]">
                        <span className="text-[#666]">
                          <span className="text-emerald-400 font-semibold">
                            {doneIssues}
                          </span>{" "}
                          completed
                        </span>
                        <span className="text-[#666]">
                          <span className="text-[#aaa] font-semibold">
                            {sprintIssues.length - doneIssues}
                          </span>{" "}
                          incomplete
                        </span>
                        {completedPoints > 0 && (
                          <span className="text-[#666]">
                            <span className="text-blue-400 font-semibold">
                              {completedPoints}
                            </span>{" "}
                            points delivered
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Burndown chart (active + completed sprints) */}
                  {(sprint.status === "active" || sprint.status === "completed") && (
                    <div className="border-b border-white/[0.04]">
                      <SprintBurndownChart sprint={sprint} />
                    </div>
                  )}

                  {/* Issue list */}
                  {sprintIssues.length === 0 ? (
                    <div className="px-5 py-6 text-[12px] text-[#555] text-center">
                      No issues in this sprint
                    </div>
                  ) : (
                    sprintIssues.map((issue, idx) => {
                      const identifier = projectIdentifier
                        ? `${projectIdentifier}-${issue.sequence_id}`
                        : `#${issue.sequence_id}`;
                      const stateCategory =
                        issue.workflow_state?.category || "todo";
                      const stateName = issue.workflow_state?.name || "—";
                      const stateDot =
                        stateCategory === "done"
                          ? "bg-emerald-400"
                          : stateCategory === "in_progress"
                            ? "bg-amber-400"
                            : "bg-zinc-400";

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
                          <span className="text-[10px] text-[#555] bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/[0.04]">
                            {stateName}
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

      {/* Warning Modal — Sprint already active */}
      {warningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setWarningModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <AlertTriangle size={20} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-white">
                  Sprint Already Active
                </h3>
                <p className="text-[12px] text-[#666]">
                  Only one sprint can be active at a time
                </p>
              </div>
            </div>
            <p className="text-[13px] text-[#999] leading-relaxed">
              Complete the currently active sprint before starting a new one.
              This ensures your team properly closes the current cycle and
              reviews their work.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setWarningModal(false)}
                className="text-[13px] font-medium text-[#888] hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setWarningModal(false);
                  const activeSprint = sprints.find(
                    (s) => s.status === "active",
                  );
                  if (activeSprint) {
                    onCompleteSprint?.(activeSprint);
                  }
                }}
                className="flex items-center gap-2 text-[13px] font-semibold text-amber-400 bg-amber-500/[0.08] hover:bg-amber-500/[0.15] px-4 py-2 rounded-lg border border-amber-500/20 transition-all"
              >
                <CheckCircle2 size={14} />
                Complete Current Sprint
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
