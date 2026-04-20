"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, Loader2, AlertCircle, Circle } from "lucide-react";
import { staggerContainer, staggerItem, fadeIn } from "@/lib/motion";
import type { IssueWithRelations } from "@/types/index";
import { getMyIssues } from "@/app/actions/issue.actions";

interface MyIssuesFeedProps {
  workspaceId: string | null;
}

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-amber-400",
  low: "bg-zinc-500",
};

export function MyIssuesFeed({ workspaceId }: MyIssuesFeedProps) {
  const [issues, setIssues] = useState<IssueWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!workspaceId) {
      setIsLoading(false);
      return;
    }

    const loadIssues = async () => {
      try {
        const result = await getMyIssues(workspaceId);
        if (result.success && result.data) {
          setIssues(result.data);
        } else {
          setError(result.error || "Failed to load issues");
        }
      } catch (err) {
        setError("Failed to load issues");
      } finally {
        setIsLoading(false);
      }
    };

    loadIssues();
  }, [workspaceId]);

  if (isLoading) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center h-full"
      >
        <Loader2 className="animate-spin text-[#555]" size={24} />
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 gap-2">
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
        {/* Decorative glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
          <Inbox size={28} className="text-[#444]" />
        </div>
        <div className="text-center max-w-sm relative">
          <h2 className="text-[16px] font-semibold text-[#999] mb-1.5">
            You&apos;re all caught up
          </h2>
          <p className="text-[13px] text-[#555] leading-relaxed">
            Issues assigned to you that are not yet done will appear here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="overflow-y-auto h-full"
    >
      {issues.map((issue, idx) => (
        <motion.div
          key={issue.id}
          variants={staggerItem}
          className={`flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer ${
            idx !== issues.length - 1 ? "border-b border-white/[0.03]" : ""
          }`}
        >
          <Circle size={14} className="text-[#444] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#ccc] font-medium truncate">
              {issue.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {issue.workflow_state && (
                <span className="text-[11px] text-[#555]">
                  {issue.workflow_state.name}
                </span>
              )}
              {issue.sprint && (
                <>
                  <span className="text-[#333]">·</span>
                  <span className="text-[11px] text-[#555]">
                    {issue.sprint.name}
                  </span>
                </>
              )}
            </div>
          </div>
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              PRIORITY_DOT[issue.priority] || PRIORITY_DOT.medium
            }`}
            title={issue.priority}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
