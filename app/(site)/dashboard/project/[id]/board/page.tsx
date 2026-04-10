"use client";

import React, { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/dashboard/project/board/KanbanBoard";
import { IssueDetailModal } from "@/components/dashboard/project/issue/IssueDetailModal";
import { Loader2, AlertCircle, Plus, Zap } from "lucide-react";
import type { Issue, WorkflowState, Sprint } from "@/types/index";
import axios from "axios";

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { id: projectId } = React.use(params);

  const [issues, setIssues] = useState<Issue[]>([]);
  const [workflowStates, setWorkflowStates] = useState<WorkflowState[]>([]);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [projectIdentifier, setProjectIdentifier] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    if (projectId) loadBoardData(projectId);
  }, [projectId]);

  const loadBoardData = async (pId: string) => {
    setError("");
    try {
      // Fetch project info, workflow states, sprints, and issues in parallel
      const [projectRes, statesRes, sprintsRes, issuesRes] = await Promise.all([
        axios.get(`/api/projects/${pId}`),
        axios.get(`/api/workflow-states?projectId=${pId}`),
        axios.get(`/api/sprints?projectId=${pId}`),
        axios.get(`/api/issues?projectId=${pId}`),
      ]);

      if (projectRes.data.success) {
        setProjectIdentifier(projectRes.data.data.identifier || "");
      }

      if (statesRes.data.success) {
        setWorkflowStates(statesRes.data.data);
      }

      // Find active sprint
      if (sprintsRes.data.success) {
        const active = sprintsRes.data.data.find(
          (s: Sprint) => s.status === "active"
        );
        setActiveSprint(active || null);
      }

      if (issuesRes.data.success) {
        // Filter to active sprint issues if there's an active sprint
        const allIssues = issuesRes.data.data as Issue[];
        setIssues(allIssues);
      }
    } catch (err) {
      setError("Failed to load board data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueMoved = async (issueId: string, newStateId: string) => {
    try {
      await axios.patch(`/api/issues/${issueId}`, { state_id: newStateId });
    } catch (err) {
      console.error("Failed to update issue state:", err);
      // Could revert the optimistic update here
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-[#555]" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 gap-2">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sprint Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.04] shrink-0">
        <div className="flex items-center gap-3">
          <Zap size={15} className="text-amber-400" />
          <span className="text-[13px] font-medium text-[#ccc]">
            {activeSprint ? activeSprint.name : "All Issues"}
          </span>
          {activeSprint && (
            <span className="text-[11px] text-[#555] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.04]">
              Active
            </span>
          )}
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#888] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.06] transition-all">
          <Plus size={14} />
          New Issue
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden p-4">
        {workflowStates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#555] gap-3">
            <Zap size={40} className="text-[#333]" />
            <p className="text-[14px] font-medium text-[#777]">
              No workflow states configured
            </p>
            <p className="text-[12px] text-[#555]">
              Set up workflow states to start using the board
            </p>
          </div>
        ) : (
          <KanbanBoard
            workflowStates={workflowStates}
            issues={issues}
            projectIdentifier={projectIdentifier}
            onIssueClick={setSelectedIssue}
            onIssueMoved={handleIssueMoved}
          />
        )}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          projectIdentifier={projectIdentifier}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
