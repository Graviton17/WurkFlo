"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ListChecks,
  Loader2,
  AlertCircle,
  Circle,
  Hash,
} from "lucide-react";
import { staggerContainer, staggerItem, fadeIn } from "@/lib/motion";
import type { IssueWithRelations } from "@/types/index";
import Link from "next/link";

import { getMyIssues } from "@/app/actions/issue.actions";

interface IssueGroup {
  label: string;
  dot: string;
  issues: IssueWithRelations[];
}

interface MyIssuesListProps {
  workspaceId: string;
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
      <motion.div variants={fadeIn} initial="hidden" animate="visible" className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#ff1f1f]/40" size={28} />
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400 gap-2">
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
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#ff1f1f]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
          <ListChecks size={28} className="text-[#444]" />
        </div>
        <div className="text-center max-w-sm relative">
          <h2 className="text-[16px] font-semibold text-[#999] mb-1.5">
            No issues assigned
          </h2>
          <p className="text-[13px] text-[#555] leading-relaxed">
            Issues assigned to you across all projects will appear here,
            grouped by status.
          </p>
        </div>
      </motion.div>
    );
  }

  const groups: IssueGroup[] = [
    { label: "Urgent", dot: "bg-red-400", issues: issues.filter((i) => i.priority === "urgent") },
    { label: "High", dot: "bg-orange-400", issues: issues.filter((i) => i.priority === "high") },
    { label: "Medium", dot: "bg-amber-400", issues: issues.filter((i) => i.priority === "medium") },
    { label: "Low", dot: "bg-zinc-500", issues: issues.filter((i) => i.priority === "low") },
  ].filter((g) => g.issues.length > 0);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="p-4 space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="flex items-center gap-2 px-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${group.dot}`} />
            <h3 className="text-[12px] font-semibold text-[#777] uppercase tracking-wider">
              {group.label}
            </h3>
            <span className="text-[11px] text-[#444] font-mono">
              {group.issues.length}
            </span>
          </div>

          <div className="space-y-0.5">
            {group.issues.map((issue) => (
              <motion.div
                key={issue.id}
                variants={staggerItem}
              >
                <Link
                  href={`/dashboard/project/${issue.project_id}/board`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <Circle size={14} className="text-[#444] shrink-0" />
                  
                  {/* Project identifier tag */}
                  {issue.project && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#555] bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5 shrink-0">
                      <Hash size={9} className="text-[#444]" />
                      {issue.project.identifier}
                    </span>
                  )}

                  <span className="text-[11px] font-mono text-[#555] w-10 shrink-0">
                    #{issue.sequence_id}
                  </span>
                  <span className="text-[13px] text-[#bbb] group-hover:text-white flex-1 truncate transition-colors font-medium">
                    {issue.title}
                  </span>
                  
                  {/* Workflow state pill */}
                  {issue.workflow_state && (
                    <span className="text-[10px] font-medium text-[#555] bg-white/[0.03] border border-white/[0.05] rounded-full px-2 py-0.5 shrink-0">
                      {issue.workflow_state.name}
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-medium uppercase shrink-0 ${
                      issue.issue_type === "bug"
                        ? "text-red-400"
                        : issue.issue_type === "story"
                        ? "text-blue-400"
                        : "text-[#555]"
                    }`}
                  >
                    {issue.issue_type}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
