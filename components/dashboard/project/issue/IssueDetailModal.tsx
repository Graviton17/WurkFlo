"use client";

import { useState } from "react";
import {
  X,
  User,
  Tag,
  Milestone,
  Kanban,
  Bug,
  AlertCircle,
  GitBranch,
  GitPullRequest,
  CheckCircle,
  XCircle,
  Hash,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Issue } from "@/types/index";

interface IssueDetailModalProps {
  issue: Issue | null;
  projectIdentifier?: string;
  onClose: () => void;
}

const PRIORITY_OPTIONS = [
  { value: "urgent", label: "Urgent", color: "text-red-400" },
  { value: "high", label: "High", color: "text-orange-400" },
  { value: "medium", label: "Medium", color: "text-amber-400" },
  { value: "low", label: "Low", color: "text-zinc-400" },
];

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo", dot: "bg-zinc-400" },
  { value: "in_progress", label: "In Progress", dot: "bg-amber-400" },
  { value: "done", label: "Done", dot: "bg-emerald-400" },
];

export function IssueDetailModal({
  issue,
  projectIdentifier,
  onClose,
}: IssueDetailModalProps) {
  const [description, setDescription] = useState(
    typeof issue?.description === "string" ? issue.description : ""
  );

  if (!issue) return null;

  const identifier = projectIdentifier
    ? `${projectIdentifier}-${issue.sequence_id}`
    : `#${issue.sequence_id}`;
  const priority =
    PRIORITY_OPTIONS.find((p) => p.value === issue.priority) ||
    PRIORITY_OPTIONS[2];

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
                    placeholder="1. Navigate to the page&#10;2. Click the button&#10;3. Observe the error"
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
                  {/* Git Branch */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                    <GitBranch size={15} className="text-[#666] shrink-0" />
                    <span className="text-[12.5px] text-[#777] font-mono">
                      No linked branches
                    </span>
                  </div>
                  {/* Pull Request */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                    <GitPullRequest
                      size={15}
                      className="text-[#666] shrink-0"
                    />
                    <span className="text-[12.5px] text-[#777] font-mono">
                      No pull requests
                    </span>
                  </div>
                  {/* CI/CD */}
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
                {/* Status */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Status
                  </label>
                  <select className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-[12.5px] text-[#ccc] outline-none hover:border-white/[0.1] focus:border-indigo-500/30 transition-colors appearance-none cursor-pointer">
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Priority
                  </label>
                  <div
                    className={`px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] ${priority.color}`}
                  >
                    {priority.label}
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Assignee
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#888]">
                    <User size={13} />
                    <span>{issue.assignee_id ? "Assigned" : "Unassigned"}</span>
                  </div>
                </div>

                {/* Story Points */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Story Points
                  </label>
                  <div className="px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#888] font-mono">
                    {issue.estimate || "—"}
                  </div>
                </div>

                <div className="border-t border-white/[0.04] pt-4 mt-4" />

                {/* Epic */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Epic
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#666]">
                    <Milestone size={13} />
                    <span>{issue.epic_id ? "Linked" : "None"}</span>
                  </div>
                </div>

                {/* Sprint */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Sprint
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#666]">
                    <Kanban size={13} />
                    <span>{issue.sprint_id ? "Active" : "No sprint"}</span>
                  </div>
                </div>

                {/* Release */}
                <div>
                  <label className="block text-[11px] text-[#555] mb-1.5 font-medium">
                    Release
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[12.5px] text-[#666]">
                    <Tag size={13} />
                    <span>{issue.release_id ? "Linked" : "None"}</span>
                  </div>
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
