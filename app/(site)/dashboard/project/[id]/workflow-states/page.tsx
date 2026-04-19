"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Layers, Plus, Loader2, AlertCircle, Trash2, GripVertical } from "lucide-react";
import { WorkflowState, StateCategoryEnum, Issue } from "@/types/index";
import { AddColumnDialog } from "@/components/dashboard/workflow-states/AddColumnDialog";
import { WorkflowKanbanBoard } from "@/components/dashboard/workflow-states/WorkflowKanbanBoard";
import { CreateIssueDialog } from "@/components/dashboard/issues/CreateIssueDialog";
import { getWorkflowConfigData } from "@/app/actions/workflow.actions";
import { useCreateIssue } from "@/components/dashboard/issues/CreateIssueContext";

interface WorkflowStatesPageProps {
  params: Promise<{ id: string }>;
}

const CATEGORY_COLORS: Record<StateCategoryEnum, { accent: string; dot: string; label: string }> = {
  todo: { accent: "#71717a", dot: "#a1a1aa", label: "Todo" },
  in_progress: { accent: "#3b82f6", dot: "#60a5fa", label: "In Progress" },
  done: { accent: "#22c55e", dot: "#4ade80", label: "Done" },
};

export default function WorkflowStatesPage({ params }: WorkflowStatesPageProps) {
  const { id: projectId } = React.use(params);

  const [states, setStates] = useState<WorkflowState[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { openCreateIssue } = useCreateIssue();
  const [workspaceId, setWorkspaceId] = useState("");

  const fetchData = useCallback(async (pId: string) => {
    setError("");
    try {
      const result = await getWorkflowConfigData(pId);
      if (result.success && result.data) {
        setStates(result.data.states);
        setIssues(result.data.issues);
        setWorkspaceId(result.data.workspaceId);
      } else {
        setError(result.error || "Failed to load workflow states");
      }
    } catch {
      setError("Failed to load workflow states and issues");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectId) fetchData(projectId);
  }, [projectId, fetchData]);

  const handleAdded = (newState: WorkflowState) => {
    setStates((prev) =>
      [...prev, newState].sort((a, b) => a.position - b.position)
    );
  };

  const handleCreateIssueSuccess = (newIssue: Issue) => {
    setIssues((prev) => [...prev, newIssue]);
  };

  const nextPosition =
    states.length > 0 ? Math.max(...states.map((s) => s.position)) + 1 : 1;

  return (
    <div className="flex flex-col min-h-[calc(100vh-52px)] w-full bg-[#1a1a1a] text-[#f0f0f0]">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#888]" />
          <h1 className="text-xl font-semibold">Workflow States</h1>
          {!isLoading && (
            <span className="text-xs text-[#555] ml-1">{states.length} states</span>
          )}
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors border border-white/10 shadow-sm"
        >
          <Plus size={14} />
          Add State
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-[#888]" size={32} />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-400 gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        ) : (
          <WorkflowKanbanBoard
            states={states}
            issues={issues}
            projectId={projectId}
            workspaceId={workspaceId}
            onCreateIssue={(stateId) => {
              openCreateIssue(stateId);
            }}
            onAddColumn={() => setDialogOpen(true)}
          />
        )}
      </div>

      <AddColumnDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projectId={projectId}
        onSuccess={handleAdded}
        nextPosition={nextPosition}
      />
    </div>
  );
}
