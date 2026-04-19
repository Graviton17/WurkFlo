"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X, Bot, Tag, Calendar,
} from "lucide-react";
import { useState } from "react";
import { updateIssueProperty } from "@/app/actions/issue.actions";
import { Issue, IssuePriority, IssueType, WorkflowState } from "@/types/index";
import { AssigneePicker } from "./AssigneePicker";

interface EditIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issue: Issue;
  states: WorkflowState[];
  workspaceId: string;
  onSuccess: (issue: Issue) => void;
}

const PRIORITY_OPTIONS: { label: string; value: IssuePriority; color: string }[] = [
  { label: "Low",    value: "low",    color: "#71717a" },
  { label: "Medium", value: "medium", color: "#eab308" },
  { label: "High",   value: "high",   color: "#f97316" },
  { label: "Urgent", value: "urgent", color: "#ef4444" },
];

const TYPE_OPTIONS: { label: string; value: IssueType }[] = [
  { label: "Task",  value: "task" },
  { label: "Bug",   value: "bug"  },
  { label: "Story", value: "story"},
];

export function EditIssueDialog({
  open,
  onOpenChange,
  issue,
  states,
  workspaceId,
  onSuccess,
}: EditIssueDialogProps) {
  const [title,       setTitle]       = useState(issue.title);
  const [description, setDescription] = useState(issue.description || "");
  const [priority,    setPriority]    = useState<IssuePriority>(issue.priority || "medium");
  const [issueType,   setIssueType]   = useState<IssueType>(issue.issue_type || "task");
  const [assigneeId,  setAssigneeId]  = useState<string | null>(issue.assignee_id);
  const [stateId,     setStateId]     = useState<string>(
    issue.state_id || "unassigned"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");

  // Sync state when issue changes
  React.useEffect(() => {
    setTitle(issue.title);
    setDescription(issue.description || "");
    setPriority(issue.priority || "medium");
    setIssueType(issue.issue_type || "task");
    setAssigneeId(issue.assignee_id);
    setStateId(issue.state_id || "unassigned");
  }, [issue, open]);

  const handleSubmit = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    setIsSubmitting(true);
    setError("");

    try {
      const result = await updateIssueProperty(issue.id, {
        state_id:     stateId === "unassigned" ? null : (stateId || null),
        title:        title.trim(),
        description:  description || null,
        priority,
        issue_type:   issueType,
        assignee_id:  assigneeId,
      });

      if (result.success && result.data) {
        onSuccess(result.data as Issue);
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to update issue");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[40%] z-50 grid w-full max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl">
          
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <DialogPrimitive.Title className="text-lg font-semibold text-white">Edit issue</DialogPrimitive.Title>
                <span className="text-[11px] font-mono text-[#555] bg-white/[0.04] px-2 py-0.5 rounded-lg border border-white/[0.06]">
                  #{issue.sequence_id}
                </span>
              </div>
              <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none text-white">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>

            {/* Context bar — shows selected state */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5">
              <span className="text-xs text-[#555]">Column:</span>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="text-xs text-[#a0a0a0] bg-white/[0.03] border border-white/10 rounded-xl px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/20"
              >
                <option value="unassigned">Unassigned</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Inputs */}
            <div className="flex flex-col px-6 py-4 gap-4">
              {/* Title only — ID is read-only in header */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Issue title"
                autoFocus
                className="w-full bg-white/[0.03] border border-white/10 py-3 px-4 rounded-xl text-[15px] text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
              />

              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description…"
                  className="w-full h-[140px] bg-white/[0.03] border border-white/10 py-3 px-4 rounded-xl text-sm text-[#ccc] placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all resize-none"
                />
                <button className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[#888] hover:text-white transition-colors">
                  <Bot size={14} />
                  <span className="text-xs font-medium">AI</span>
                </button>
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}

              {/* Action tags */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Priority */}
                <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPriority(opt.value)}
                      className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        priority === opt.value
                          ? "text-white"
                          : "text-[#666] hover:text-[#aaa]"
                      }`}
                      style={priority === opt.value ? { color: opt.color } : {}}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Type */}
                <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setIssueType(opt.value)}
                      className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        issueType === opt.value
                          ? "text-white bg-white/10"
                          : "text-[#666] hover:text-[#aaa]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Assignee — functional */}
                <AssigneePicker
                  workspaceId={workspaceId}
                  selectedUserId={assigneeId}
                  onSelect={setAssigneeId}
                />

                {/* Labels — coming soon */}
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-[#a0a0a0] opacity-50 cursor-not-allowed"
                  >
                    <Tag size={13} /> Labels
                  </button>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#222] text-[10px] text-[#aaa] px-2 py-1 rounded-lg border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Coming soon
                  </div>
                </div>

                {/* Due date — coming soon */}
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-[#a0a0a0] opacity-50 cursor-not-allowed"
                  >
                    <Calendar size={13} /> Due date
                  </button>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#222] text-[10px] text-[#aaa] px-2 py-1 rounded-lg border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Coming soon
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2 border-t border-white/[0.06] bg-[#0a0a0a]/60 rounded-b-2xl">

              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] rounded-full transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#009b65] hover:bg-[#009b65]/90 text-white text-sm font-medium rounded-full transition-all shadow-[0_0_20px_-6px_rgba(0,155,101,0.4)] disabled:opacity-50"
              >
                {isSubmitting ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
