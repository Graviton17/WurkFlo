"use client";

import { useState, useEffect } from "react";
import {
  ListChecks,
  Loader2,
  AlertCircle,
  User,
  Circle,
  Hash,
} from "lucide-react";
import type { Issue } from "@/types/index";
import axios from "axios";

interface IssueGroup {
  label: string;
  dot: string;
  issues: Issue[];
}

export function MyIssuesList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyIssues();
  }, []);

  const loadMyIssues = async () => {
    try {
      // For now, we just show the empty state since we don't have a way to
      // query all issues across projects by assignee yet.
      // In future: GET /api/issues?assigneeId={userId}
      setIssues([]);
    } catch (err) {
      setError("Failed to load your issues");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#555]" size={28} />
      </div>
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
      <div className="flex flex-col items-center justify-center h-full text-[#555] gap-4 px-6">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
          <ListChecks size={28} className="text-[#444]" />
        </div>
        <div className="text-center max-w-sm">
          <h2 className="text-[16px] font-semibold text-[#999] mb-1.5">
            No issues assigned
          </h2>
          <p className="text-[13px] text-[#555] leading-relaxed">
            Issues assigned to you across all projects will appear here,
            grouped by status.
          </p>
        </div>
      </div>
    );
  }

  // Group by priority
  const groups: IssueGroup[] = [
    {
      label: "Urgent",
      dot: "bg-red-400",
      issues: issues.filter((i) => i.priority === "urgent"),
    },
    {
      label: "High",
      dot: "bg-orange-400",
      issues: issues.filter((i) => i.priority === "high"),
    },
    {
      label: "Medium",
      dot: "bg-amber-400",
      issues: issues.filter((i) => i.priority === "medium"),
    },
    {
      label: "Low",
      dot: "bg-zinc-500",
      issues: issues.filter((i) => i.priority === "low"),
    },
  ].filter((g) => g.issues.length > 0);

  return (
    <div className="p-4 space-y-6">
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
              <div
                key={issue.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                <Circle size={14} className="text-[#444] shrink-0" />
                <span className="text-[11px] font-mono text-[#555] w-14 shrink-0">
                  #{issue.sequence_id}
                </span>
                <span className="text-[13px] text-[#bbb] group-hover:text-white flex-1 truncate transition-colors font-medium">
                  {issue.title}
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
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
