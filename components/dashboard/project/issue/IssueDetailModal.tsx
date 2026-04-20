"use client";

import { useState, useCallback, useTransition, useRef, useEffect } from "react";
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
  Timer,
  Package,
  ChevronDown,
  Check,
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
  { value: "urgent", label: "Urgent", color: "text-red-400", dot: "bg-red-400" },
  { value: "high",   label: "High",   color: "text-orange-400", dot: "bg-orange-400" },
  { value: "medium", label: "Medium", color: "text-amber-400", dot: "bg-amber-400" },
  { value: "low",    label: "Low",    color: "text-zinc-400",  dot: "bg-zinc-500" },
];

// ─── Reusable custom dropdown ────────────────────────────────────────────────
interface DropdownOption {
  value: string;
  label: string;
  colorClass?: string;
  dotClass?: string;
}

function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = "Select…",
  icon,
}: {
  value: string;
  options: DropdownOption[];
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] rounded-lg text-[12.5px] text-[#ccc] outline-none transition-all cursor-pointer"
      >
        {icon && <span className="shrink-0 text-[#555]">{icon}</span>}
        {selected?.dotClass && (
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selected.dotClass}`} />
        )}
        <span className={`flex-1 text-left truncate ${selected?.colorClass ?? "text-[#888]"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={13}
          className={`shrink-0 text-[#555] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute z-[200] left-0 right-0 mt-1 bg-[#18181b] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
            style={{ boxShadow: "0 8px 32px -4px rgba(0,0,0,0.7)" }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] transition-colors text-left
                  ${opt.value === value
                    ? "bg-white/[0.07] text-white"
                    : "text-[#aaa] hover:bg-white/[0.05] hover:text-white"
                  }`}
              >
                {opt.dotClass && (
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${opt.dotClass}`} />
                )}
                <span className={`flex-1 ${opt.colorClass ?? ""}`}>{opt.label}</span>
                {opt.value === value && <Check size={12} className="text-white/50 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main modal ──────────────────────────────────────────────────────────────
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
    PRIORITY_OPTIONS.find((p) => p.value === issue.priority) || PRIORITY_OPTIONS[2];
  const currentState = workflowStates.find((s) => s.id === issue.state_id);

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
    const current = typeof issue.description === "string" ? issue.description : "";
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

  // Build option arrays for selects
  const stateOptions: DropdownOption[] = [
    { value: "", label: "Unassigned" },
    ...workflowStates.map((s) => ({ value: s.id, label: s.name })),
  ];

  const sprintOptions: DropdownOption[] = [
    { value: "", label: "No sprint" },
    ...sprints.map((s) => ({
      value: s.id,
      label: s.name + (s.status === "active" ? " ●" : ""),
    })),
  ];

  const epicOptions: DropdownOption[] = [
    { value: "", label: "None" },
    ...epics.map((e) => ({ value: e.id, label: e.name })),
  ];

  const releaseOptions: DropdownOption[] = [
    { value: "", label: "None" },
    ...releases.map((r) => ({ value: r.id, label: r.version })),
  ];

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

              {/* Description */}
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
                    <span className="text-[12.5px] text-[#777] font-mono">No linked branches</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                    <GitPullRequest size={15} className="text-[#666] shrink-0" />
                    <span className="text-[12.5px] text-[#777] font-mono">No pull requests</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                    <CheckCircle size={15} className="text-[#666] shrink-0" />
                    <span className="text-[12.5px] text-[#777]">No CI/CD pipeline linked</span>
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
                {/* Status */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Status
                  </label>
                  {workflowStates.length > 0 ? (
                    <CustomDropdown
                      value={issue.state_id || ""}
                      options={stateOptions}
                      onChange={(v) => saveProperty("state_id", v || null)}
                      placeholder="Unassigned"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#888]">
                      {currentState?.name || issue.workflow_state?.name || "—"}
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Priority
                  </label>
                  <CustomDropdown
                    value={issue.priority || "medium"}
                    options={PRIORITY_OPTIONS.map((p) => ({
                      value: p.value,
                      label: p.label,
                      colorClass: p.color,
                      dotClass: p.dot,
                    }))}
                    onChange={(v) => saveProperty("priority", v)}
                  />
                </div>

                {/* Assignee */}
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

                {/* Story Points */}
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

                {/* Sprint */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Sprint
                  </label>
                  {sprints.length > 0 ? (
                    <CustomDropdown
                      value={issue.sprint_id || ""}
                      options={sprintOptions}
                      onChange={(v) => saveProperty("sprint_id", v || null)}
                      placeholder="No sprint"
                      icon={<Timer size={13} className="text-blue-400/70" />}
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#666]">
                      <Kanban size={13} />
                      <span>
                        {issue.sprint?.name || (issue.sprint_id ? "Active" : "No sprint")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Epic */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Epic
                  </label>
                  {epics.length > 0 ? (
                    <CustomDropdown
                      value={issue.epic_id || ""}
                      options={epicOptions}
                      onChange={(v) => saveProperty("epic_id", v || null)}
                      placeholder="None"
                      icon={<Milestone size={13} className="text-purple-400/70" />}
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#666]">
                      <Milestone size={13} />
                      <span>{issue.epic?.name || (issue.epic_id ? "Linked" : "None")}</span>
                    </div>
                  )}
                </div>

                {/* Release */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Release
                  </label>
                  {releases.length > 0 ? (
                    <CustomDropdown
                      value={issue.release_id || ""}
                      options={releaseOptions}
                      onChange={(v) => saveProperty("release_id", v || null)}
                      placeholder="None"
                      icon={<Package size={13} className="text-emerald-400/70" />}
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#666]">
                      <Tag size={13} />
                      <span>
                        {issue.release?.version || (issue.release_id ? "Linked" : "None")}
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
