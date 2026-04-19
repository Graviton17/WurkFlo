"use client";

import { useState, useCallback, useTransition } from "react";
import {
  X,
  User,
  Tag,
  Milestone,
  Kanban,
  AlertCircle,
  GitBranch,
  GitPullRequest,
  CheckCircle,
  Hash,
  Timer,
  Package,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { IssueWithRelations, WorkflowState, Sprint, Epic, Release } from "@/types/index";
import { updateIssueProperty } from "@/app/actions/issue.actions";
import { AssigneePicker } from "@/components/dashboard/issues/AssigneePicker";

interface IssueDetailModalProps {
  issue: IssueWithRelations;
  projectIdentifier?: string;
  workflowStates?: WorkflowState[];
  workspaceId?: string;
  sprints?: Sprint[];
  epics?: Epic[];
  releases?: Release[];
  onClose: () => void;
  onUpdate?: (updated: IssueWithRelations) => void;
}

const PRIORITY_OPTIONS = [
  { value: "urgent", label: "Urgent", color: "text-red-400", bg: "bg-red-500/10 border-red-500/15" },
  { value: "high", label: "High", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/15" },
  { value: "medium", label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/15" },
  { value: "low", label: "Low", color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/15" },
];

export function IssueDetailModal({
  issue,
  projectIdentifier,
  workflowStates = [],
  workspaceId,
  sprints = [],
  epics = [],
  releases = [],
  onClose,
  onUpdate,
}: IssueDetailModalProps) {
  const [description, setDescription] = useState(
    typeof issue?.description === "string" ? issue.description : ""
  );
  const [estimate, setEstimate] = useState(
    issue.estimate != null ? String(issue.estimate) : ""
  );
  const [editingEstimate, setEditingEstimate] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!issue) return null;

  const identifier = projectIdentifier
    ? `${projectIdentifier}-${issue.sequence_id}`
    : `#${issue.sequence_id}`;
  const currentPriority =
    PRIORITY_OPTIONS.find((p) => p.value === issue.priority) ||
    PRIORITY_OPTIONS[2];
  const currentState = workflowStates.find((s) => s.id === issue.state_id);

  // Generic property updater with optimistic update
  const saveProperty = useCallback(
    (field: string, value: unknown) => {
      startTransition(async () => {
        const result = await updateIssueProperty(issue.id, { [field]: value });
        if (result.success && result.data) {
          onUpdate?.({ ...issue, ...result.data } as IssueWithRelations);
        }
      });
    },
    [issue, onUpdate],
  );

  const handleDescriptionBlur = () => {
    const current =
      typeof issue.description === "string" ? issue.description : "";
    if (description !== current) {
      saveProperty("description", description || null);
    }
  };

  const handleEstimateSubmit = () => {
    setEditingEstimate(false);
    const num = estimate.trim() ? parseInt(estimate, 10) : null;
    if (isNaN(num as any) && num !== null) return;
    if (num !== issue.estimate) {
      saveProperty("estimate", num);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-stretch justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        />

        {/* Panel */}
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full max-w-[800px] bg-[#111113] border-l border-white/[0.06] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/15 font-semibold">
                {identifier}
              </span>
              {issue.issue_type === "bug" && (
                <span className="flex items-center gap-1 text-[11px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/15">
                  <AlertCircle size={11} />
                  Bug
                </span>
              )}
              {isPending && (
                <span className="text-[10px] text-[#555] animate-pulse">
                  Saving...
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#555] hover:text-[#aaa] hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Title */}
              <h2 className="text-xl font-semibold text-[#e8e8e8] mb-6 leading-tight tracking-tight">
                {issue.title}
              </h2>

              {/* Description — saves on blur */}
              <div className="mb-8">
                <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-wider mb-2.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  placeholder="Add a description..."
                  rows={6}
                  className="w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] focus:border-indigo-500/30 focus:ring-1 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-[13.5px] text-[#ccc] placeholder:text-[#444] outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Bug-specific fields */}
              {issue.issue_type === "bug" && (
                <div className="mb-8">
                  <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-wider mb-2.5">
                    Reproduction Steps
                  </label>
                  <textarea
                    placeholder={"1. Navigate to the page\n2. Click the button\n3. Observe the error"}
                    rows={4}
                    className="w-full bg-red-500/[0.02] border border-red-500/[0.08] hover:border-red-500/[0.15] focus:border-red-500/30 focus:ring-1 focus:ring-red-500/20 rounded-xl px-4 py-3 text-[13.5px] text-[#ccc] placeholder:text-[#444] outline-none transition-all resize-none leading-relaxed"
                  />
                </div>
              )}

              {/* DevOps Integrations */}
              <div>
                <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-wider mb-3">
                  DevOps
                </label>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                    <GitBranch size={15} className="text-[#666] shrink-0" />
                    <span className="text-[12.5px] text-[#777] font-mono">
                      No linked branches
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                    <GitPullRequest
                      size={15}
                      className="text-[#666] shrink-0"
                    />
                    <span className="text-[12.5px] text-[#777] font-mono">
                      No pull requests
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                    <CheckCircle size={15} className="text-[#666] shrink-0" />
                    <span className="text-[12.5px] text-[#777]">
                      No CI/CD pipeline linked
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Sidebar */}
            <div className="w-[240px] border-l border-white/[0.04] bg-white/[0.01] p-5 overflow-y-auto shrink-0">
              <h3 className="text-[11px] font-semibold text-[#555] uppercase tracking-wider mb-4">
                Properties
              </h3>

              <div className="space-y-4">
                {/* Status — real workflow states */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Status
                  </label>
                  {workflowStates.length > 0 ? (
                    <select
                      value={issue.state_id || ""}
                      onChange={(e) =>
                        saveProperty("state_id", e.target.value || null)
                      }
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-[12.5px] text-[#ccc] outline-none hover:border-white/[0.1] focus:border-indigo-500/30 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Unassigned</option>
                      {workflowStates.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#888]">
                      {currentState?.name || issue.workflow_state?.name || "—"}
                    </div>
                  )}
                </div>

                {/* Priority — clickable */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Priority
                  </label>
                  <select
                    value={issue.priority}
                    onChange={(e) => saveProperty("priority", e.target.value)}
                    className={`w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-[12.5px] outline-none hover:border-white/[0.1] focus:border-indigo-500/30 transition-colors appearance-none cursor-pointer ${currentPriority.color}`}
                  >
                    {PRIORITY_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignee — functional picker */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Assignee
                  </label>
                  {workspaceId ? (
                    <AssigneePicker
                      workspaceId={workspaceId}
                      selectedUserId={issue.assignee_id}
                      onSelect={(userId) => saveProperty("assignee_id", userId)}
                      compact
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#888]">
                      <User size={13} />
                      <span>
                        {issue.assignee?.full_name ||
                          (issue.assignee_id ? "Assigned" : "Unassigned")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Story Points — inline edit */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Story Points
                  </label>
                  {editingEstimate ? (
                    <input
                      type="number"
                      autoFocus
                      value={estimate}
                      onChange={(e) => setEstimate(e.target.value)}
                      onBlur={handleEstimateSubmit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEstimateSubmit();
                        if (e.key === "Escape") setEditingEstimate(false);
                      }}
                      className="w-full bg-white/[0.06] border border-white/20 rounded-lg px-3 py-2 text-[12.5px] text-white font-mono outline-none focus:ring-1 focus:ring-indigo-500/30"
                    />
                  ) : (
                    <div
                      onClick={() => setEditingEstimate(true)}
                      className="px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#888] font-mono cursor-pointer hover:border-white/[0.12] hover:text-white transition-all"
                    >
                      {issue.estimate || "—"}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/[0.04] pt-4 mt-4" />

                {/* Sprint — editable dropdown */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Sprint
                  </label>
                  {sprints.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Timer size={13} className="text-blue-400/70 shrink-0" />
                      <select
                        value={issue.sprint_id || ""}
                        onChange={(e) =>
                          saveProperty("sprint_id", e.target.value || null)
                        }
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-[12.5px] text-[#ccc] outline-none hover:border-white/[0.1] focus:border-indigo-500/30 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">No sprint</option>
                        {sprints.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} {s.status === "active" ? "●" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#666]">
                      <Kanban size={13} />
                      <span>
                        {issue.sprint?.name ||
                          (issue.sprint_id ? "Active" : "No sprint")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Epic — editable dropdown */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Epic
                  </label>
                  {epics.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Milestone size={13} className="text-[#ff1f1f]/70 shrink-0" />
                      <select
                        value={issue.epic_id || ""}
                        onChange={(e) =>
                          saveProperty("epic_id", e.target.value || null)
                        }
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-[12.5px] text-[#ccc] outline-none hover:border-white/[0.1] focus:border-indigo-500/30 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">No epic</option>
                        {epics.map((e) => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#666]">
                      <Milestone size={13} />
                      <span>
                        {issue.epic?.name || (issue.epic_id ? "Linked" : "None")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Release — editable dropdown */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Release
                  </label>
                  {releases.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Package size={13} className="text-emerald-400/70 shrink-0" />
                      <select
                        value={issue.release_id || ""}
                        onChange={(e) =>
                          saveProperty("release_id", e.target.value || null)
                        }
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-[12.5px] text-[#ccc] outline-none hover:border-white/[0.1] focus:border-indigo-500/30 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">No release</option>
                        {releases.map((r) => (
                          <option key={r.id} value={r.id}>{r.version}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#666]">
                      <Tag size={13} />
                      <span>
                        {issue.release?.version ||
                          (issue.release_id ? "Linked" : "None")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="mt-6 pt-4 border-t border-white/[0.04] space-y-2">
                <div className="text-[11px] text-[#444]">
                  <span className="text-[#555]">Created </span>
                  {new Date(issue.created_at).toLocaleDateString()}
                </div>
                <div className="text-[11px] text-[#444]">
                  <span className="text-[#555]">Updated </span>
                  {new Date(issue.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
