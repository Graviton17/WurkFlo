"use client";

import React, { useState } from "react";
import { WorkflowState, Issue, IssuePriority, IssueType } from "@/types/index";
import { EditIssueDialog } from "./EditIssueDialog";
import { Bug, BookOpen, CheckSquare } from "lucide-react";

interface IssueListProps {
  states: WorkflowState[];
  issues: Issue[];
  projectId: string;
  workspaceId: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const PRIORITY_COLORS: Record<IssuePriority, string> = {
  low:    "#71717a",
  medium: "#eab308",
  high:   "#f97316",
  urgent: "#ef4444",
};

const PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: "Low", medium: "Med", high: "High", urgent: "Urgent",
};

function TypeIcon({ type }: { type: IssueType }) {
  if (type === "bug")   return <Bug size={13} className="text-red-400" />;
  if (type === "story") return <BookOpen size={13} className="text-purple-400" />;
  return <CheckSquare size={13} className="text-blue-400" />;
}

// ── IssueCardContent ────────────────────────────────────────────────────────

function IssueCardContent({
  issue,
  dotColor,
  onClick,
}: {
  issue: Issue;
  dotColor: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex items-start gap-2 cursor-pointer" onClick={onClick}>
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h4 className="text-[0.88rem] font-medium text-white leading-snug">
          {issue.title}
        </h4>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {/* Sequence ID */}
          <span className="text-[0.68rem] text-[#555] font-mono">
            #{issue.sequence_id}
          </span>

          {/* Type */}
          <TypeIcon type={issue.issue_type} />

          {/* Priority pill */}
          <span
            className="text-[0.65rem] px-1.5 py-0.5 rounded font-medium"
            style={{
              color: PRIORITY_COLORS[issue.priority],
              backgroundColor: PRIORITY_COLORS[issue.priority] + "22",
            }}
          >
            {PRIORITY_LABELS[issue.priority]}
          </span>

          {/* Dot separator */}
          <span
            className="w-1.5 h-1.5 rounded-full ml-auto"
            style={{ backgroundColor: dotColor }}
          />
        </div>
      </div>
    </div>
  );
}

// ── IssueList ──────────────────────────────────────────────────────────────

export function IssueList({
  states,
  issues: initialIssues,
  projectId,
  workspaceId,
}: IssueListProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  // Sync when props change
  React.useEffect(() => {
    setIssues(initialIssues);
  }, [initialIssues]);

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 text-[#555]">
        <div className="text-center">
          <p className="text-sm text-[#aaa] font-medium mb-1">No issues yet</p>
          <p className="text-xs text-[#555]">Create your first issue using the button above</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap content-start items-start h-full gap-4 pb-4 overflow-y-auto">
        {issues.map((issue) => (
          <div key={issue.id} className="w-[320px] bg-[#222] p-3.5 rounded-lg border border-white/5 shadow-sm hover:border-white/15 transition-colors">
            <IssueCardContent issue={issue} dotColor="#666" onClick={() => setEditingIssue(issue)} />
          </div>
        ))}
      </div>

      {editingIssue && (
        <EditIssueDialog
          open={!!editingIssue}
          onOpenChange={(open) => {
            if (!open) setEditingIssue(null);
          }}
          issue={editingIssue}
          states={states}
          workspaceId={workspaceId}
          onSuccess={(updatedIssue: Issue) => {
            setIssues(prev => prev.map(i => i.id === updatedIssue.id ? updatedIssue : i));
          }}
        />
      )}
    </>
  );
}
