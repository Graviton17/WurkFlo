"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ListChecks,
  Loader2,
  AlertCircle,
  Circle,
  Hash,
  Bug,
  Bookmark,
  Layers,
} from "lucide-react";
import { staggerContainer, staggerItem, fadeIn } from "@/lib/motion";
import type { IssueWithRelations } from "@/types/index";
import Link from "next/link";

import { getMyIssues } from "@/app/actions/issue.actions";

interface IssueGroup {
  label: string;
  priorityKey: string;
  issues: IssueWithRelations[];
}

interface MyIssuesListProps {
  workspaceId: string;
}

const PRIORITY_CONFIG: Record<
  string,
  { label: string; dotClass: string; textClass: string }
> = {
  urgent: {
    label: "Urgent",
    dotClass: "bg-[#888]",
    textClass: "text-[#aaa]",
  },
  high: {
    label: "High",
    dotClass: "bg-[#666]",
    textClass: "text-[#888]",
  },
  medium: {
    label: "Medium",
    dotClass: "bg-[#444]",
    textClass: "text-[#666]",
  },
  low: {
    label: "Low",
    dotClass: "bg-[#333]",
    textClass: "text-[#555]",
  },
};

function IssueTypeTag({ type }: { type: string }) {
  if (type === "bug") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#888] bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5 shrink-0 uppercase tracking-wide">
        <Bug size={9} className="text-[#777]" />
        Bug
      </span>
    );
  }
  if (type === "story") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#888] bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5 shrink-0 uppercase tracking-wide">
        <Bookmark size={9} className="text-[#777]" />
        Story
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#666] bg-white/[0.03] border border-white/[0.05] rounded px-1.5 py-0.5 shrink-0 uppercase tracking-wide">
      <Layers size={9} className="text-[#555]" />
      {type || "Task"}
    </span>
  );
}

export function MyIssuesList({ workspaceId }: MyIssuesListProps) {
  const [issues, setIssues] = useState<IssueWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyIssues();
  }, [workspaceId]);

  const loadMyIssues = async () => {
    try {
      setIsLoading(true);
      setError("");
      const result = await getMyIssues(workspaceId);

      if (result.success && result.data) {
        setIssues(result.data as IssueWithRelations[]);
      } else {
        setError(result.error || "Failed to load your issues");
      }
    } catch (err) {
      setError("Failed to load your issues");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center h-64"
      >
        <Loader2 className="animate-spin text-[#444]" size={24} />
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-[#888] gap-2">
        <AlertCircle size={18} />
        <span className="text-[13px]">{error}</span>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center h-full text-[#555] gap-4 px-6 relative"
      >
        <div className="relative w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
          <ListChecks size={28} className="text-[#444]" />
        </div>
        <div className="text-center max-w-sm relative">
          <h2 className="text-[16px] font-semibold text-[#999] mb-1.5">
            No issues assigned
          </h2>
          <p className="text-[13px] text-[#555] leading-relaxed">
            Issues assigned to you across all projects will appear here,
            grouped by priority.
          </p>
        </div>
      </motion.div>
    );
  }

  const priorityOrder = ["urgent", "high", "medium", "low"];
  const groups: IssueGroup[] = priorityOrder
    .map((key) => ({
      label: PRIORITY_CONFIG[key]?.label ?? key,
      priorityKey: key,
      issues: issues.filter((i) => i.priority === key),
    }))
    .filter((g) => g.issues.length > 0);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="px-4 py-4 space-y-5"
    >
      {groups.map((group) => {
        const cfg = PRIORITY_CONFIG[group.priorityKey];
        return (
          <div key={group.label}>
            {/* Group header */}
            <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dotClass}`} />
              <span
                className={`text-[11px] font-semibold uppercase tracking-widest ${cfg.textClass}`}
              >
                {group.label}
              </span>
              <span className="text-[11px] text-[#3a3a3a] font-mono ml-0.5">
                {group.issues.length}
              </span>
            </div>

            {/* Issue rows */}
            <div className="space-y-px">
              {group.issues.map((issue) => (
                <motion.div key={issue.id} variants={staggerItem}>
                  <Link
                    href={`/dashboard/project/${issue.project_id}/board`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    {/* Status circle */}
                    <Circle
                      size={13}
                      className="text-[#333] group-hover:text-[#555] shrink-0 transition-colors"
                    />

                    {/* Project identifier */}
                    {issue.project && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4a4a4a] bg-white/[0.03] border border-white/[0.05] rounded px-1.5 py-0.5 shrink-0 font-mono">
                        <Hash size={8} className="text-[#3a3a3a]" />
                        {issue.project.identifier}
                      </span>
                    )}

                    {/* Sequence ID */}
                    <span className="text-[11px] font-mono text-[#3a3a3a] shrink-0">
                      #{issue.sequence_id}
                    </span>

                    {/* Title */}
                    <span className="text-[13px] text-[#aaa] group-hover:text-[#e5e5e5] flex-1 truncate transition-colors font-medium">
                      {issue.title}
                    </span>

                    {/* Workflow state pill */}
                    {issue.workflow_state && (
                      <span className="text-[10px] text-[#444] bg-white/[0.02] border border-white/[0.04] rounded-full px-2 py-0.5 shrink-0 hidden sm:inline">
                        {issue.workflow_state.name}
                      </span>
                    )}

                    {/* Issue type badge */}
                    <IssueTypeTag type={issue.issue_type} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
