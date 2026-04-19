"use client";

import { useState, useTransition } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Inbox,
  X,
} from "lucide-react";
import type { Sprint, IssueWithRelations } from "@/types/index";
import { completeSprint } from "@/app/actions/sprint.actions";

interface CompleteSprintDialogProps {
  sprint: Sprint;
  projectId: string;
  sprintIssues: IssueWithRelations[];
  plannedSprints: Sprint[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CompleteSprintDialog({
  sprint,
  projectId,
  sprintIssues,
  plannedSprints,
  open,
  onOpenChange,
  onSuccess,
}: CompleteSprintDialogProps) {
  const [rolloverTarget, setRolloverTarget] = useState<string>("backlog");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const completedIssues = sprintIssues.filter(
    (i) => i.workflow_state?.category === "done",
  );
  const incompleteIssues = sprintIssues.filter(
    (i) => i.workflow_state?.category !== "done",
  );

  const handleComplete = () => {
    setError("");
    startTransition(async () => {
      const result = await completeSprint(sprint.id, projectId, rolloverTarget);
      if (result.success) {
        onOpenChange(false);
        onSuccess();
      } else {
        setError(result.error || "Failed to complete sprint");
      }
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isPending && onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-white">
                Complete Sprint
              </h2>
              <p className="text-[12px] text-[#666]">{sprint.name}</p>
            </div>
          </div>
          <button
            onClick={() => !isPending && onOpenChange(false)}
            className="text-[#555] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary */}
        <div className="px-6 py-5 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-xl px-4 py-3">
              <p className="text-[11px] text-emerald-400/70 font-medium uppercase tracking-wider mb-1">
                Completed
              </p>
              <p className="text-[22px] font-bold text-emerald-400">
                {completedIssues.length}
                <span className="text-[13px] text-emerald-400/50 ml-1.5">
                  issues
                </span>
              </p>
            </div>
            <div className="bg-amber-500/[0.06] border border-amber-500/15 rounded-xl px-4 py-3">
              <p className="text-[11px] text-amber-400/70 font-medium uppercase tracking-wider mb-1">
                Incomplete
              </p>
              <p className="text-[22px] font-bold text-amber-400">
                {incompleteIssues.length}
                <span className="text-[13px] text-amber-400/50 ml-1.5">
                  issues
                </span>
              </p>
            </div>
          </div>

          {/* Rollover options — only show if there are incomplete issues */}
          {incompleteIssues.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" />
                <p className="text-[13px] text-[#ccc] font-medium">
                  Where should incomplete issues go?
                </p>
              </div>

              {/* Backlog option */}
              <label
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  rolloverTarget === "backlog"
                    ? "bg-white/[0.04] border-white/20"
                    : "bg-transparent border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                <input
                  type="radio"
                  name="rollover"
                  value="backlog"
                  checked={rolloverTarget === "backlog"}
                  onChange={() => setRolloverTarget("backlog")}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    rolloverTarget === "backlog"
                      ? "border-white bg-white"
                      : "border-[#555]"
                  }`}
                >
                  {rolloverTarget === "backlog" && (
                    <div className="w-2 h-2 rounded-full bg-[#111]" />
                  )}
                </div>
                <Inbox size={15} className="text-[#666]" />
                <div>
                  <p className="text-[13px] text-[#ccc] font-medium">
                    Move to Backlog
                  </p>
                  <p className="text-[11px] text-[#555]">
                    Issues will be unassigned from any sprint
                  </p>
                </div>
              </label>

              {/* Sprint options */}
              {plannedSprints.map((s) => (
                <label
                  key={s.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                    rolloverTarget === s.id
                      ? "bg-white/[0.04] border-white/20"
                      : "bg-transparent border-white/[0.06] hover:border-white/[0.12]"
                  }`}
                >
                  <input
                    type="radio"
                    name="rollover"
                    value={s.id}
                    checked={rolloverTarget === s.id}
                    onChange={() => setRolloverTarget(s.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      rolloverTarget === s.id
                        ? "border-white bg-white"
                        : "border-[#555]"
                    }`}
                  >
                    {rolloverTarget === s.id && (
                      <div className="w-2 h-2 rounded-full bg-[#111]" />
                    )}
                  </div>
                  <ArrowRight size={15} className="text-[#666]" />
                  <div>
                    <p className="text-[13px] text-[#ccc] font-medium">
                      Move to {s.name}
                    </p>
                    <p className="text-[11px] text-[#555]">
                      Issues will be assigned to this planned sprint
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-[12px] text-red-400 bg-red-500/[0.06] border border-red-500/15 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <button
            onClick={() => !isPending && onOpenChange(false)}
            disabled={isPending}
            className="text-[13px] font-medium text-[#888] hover:text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={isPending}
            className="flex items-center gap-2 text-[13px] font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 px-5 py-2 rounded-lg shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCircle2 size={14} />
            )}
            Complete Sprint
          </button>
        </div>
      </div>
    </div>
  );
}
