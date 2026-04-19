"use client";

import React, { useState, useEffect, useTransition } from "react";
import { KanbanBoard } from "@/components/dashboard/project/board/KanbanBoard";
import { IssueDetailModal } from "@/components/dashboard/project/issue/IssueDetailModal";
import { AddColumnDialog } from "@/components/dashboard/workflow-states/AddColumnDialog";
import { Loader2, AlertCircle, Plus, Zap, Timer, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import type { IssueWithRelations, WorkflowState, Sprint, Epic, Release } from "@/types/index";
import { getSprintBoardData } from "@/app/actions/board.actions";
import { moveIssue } from "@/app/actions/issue.actions";
import { useCreateIssue } from "@/components/dashboard/issues/CreateIssueContext";

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { id: projectId } = React.use(params);

  const [issues, setIssues] = useState<IssueWithRelations[]>([]);
  const [workflowStates, setWorkflowStates] = useState<WorkflowState[]>([]);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);
  const [projectIdentifier, setProjectIdentifier] = useState<string>("");
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<IssueWithRelations | null>(null);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { openCreateIssue } = useCreateIssue();

  useEffect(() => {
    if (projectId) loadBoardData(projectId);
  }, [projectId]);

  const loadBoardData = async (pId: string) => {
    setError("");
    try {
      const result = await getSprintBoardData(pId);

      if (!result.success || !result.data) {
        setError(result.error || "Failed to load board data");
        return;
      }

      setActiveSprint(result.data.activeSprint);
      setWorkflowStates(result.data.workflowStates);
      setIssues(result.data.issues);
      setProjectIdentifier(result.data.projectIdentifier);
      setWorkspaceId(result.data.workspaceId);
      setSprints(result.data.sprints);
      setEpics(result.data.epics);
      setReleases(result.data.releases);
    } catch (err) {
      setError("Failed to load board data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueMoved = async (issueId: string, newStateId: string) => {
    // Optimistic update
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, state_id: newStateId } : issue,
      ),
    );

    startTransition(async () => {
      const result = await moveIssue(issueId, newStateId, projectId);
      if (!result.success) {
        console.error("Failed to update issue state:", result.error);
        // Revert by reloading
        loadBoardData(projectId);
      }
    });
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

  // No workflow states — must be configured before anything else can work
  if (workflowStates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#ff1f1f]/[0.08] border border-[#ff1f1f]/20 flex items-center justify-center">
          <Layers size={28} className="text-[#ff1f1f]/70" />
        </div>
        <div className="text-center space-y-1.5">
          <h2 className="text-[16px] font-semibold text-[#ddd]">
            No Workflow States Configured
          </h2>
          <p className="text-[13px] text-[#666] max-w-md leading-relaxed">
            Workflow states define the columns on your board (e.g. To Do, In Progress, Done).
            You need to set these up before creating issues or starting sprints.
          </p>
        </div>
        <Link
          href={`/dashboard/project/${projectId}/workflow-states`}
          className="flex items-center gap-2 text-[13px] font-medium text-[#ff1f1f] hover:text-[#ff4f4f] bg-[#ff1f1f]/[0.08] hover:bg-[#ff1f1f]/[0.12] px-4 py-2 rounded-lg border border-[#ff1f1f]/20 transition-all"
        >
          <Layers size={15} />
          Configure Workflow States
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // No active sprint — show empty state with CTA
  if (!activeSprint) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 flex items-center justify-center">
          <Timer size={28} className="text-amber-400/70" />
        </div>
        <div className="text-center space-y-1.5">
          <h2 className="text-[16px] font-semibold text-[#ddd]">
            No Active Sprint
          </h2>
          <p className="text-[13px] text-[#666] max-w-md leading-relaxed">
            Start a sprint to see your Kanban board. Head over to the Sprints tab
            to create and activate a sprint.
          </p>
        </div>
        <Link
          href={`/dashboard/project/${projectId}/sprints`}
          className="flex items-center gap-2 text-[13px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/[0.08] hover:bg-amber-500/[0.12] px-4 py-2 rounded-lg border border-amber-500/20 transition-all"
        >
          <Timer size={15} />
          Go to Sprints
          <ArrowRight size={14} />
        </Link>
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
            {activeSprint.name}
          </span>
          <span className="text-[11px] text-[#555] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.04]">
            Active
          </span>
        </div>
        <button 
          onClick={() => openCreateIssue()}
          className="flex items-center gap-1.5 text-[12px] font-medium text-[#888] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.06] transition-all"
        >
          <Plus size={14} />
          New Issue
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden p-4">
        {/* Workflow states are guaranteed to exist at this point (guard above) */}
        <KanbanBoard
            workflowStates={workflowStates}
            issues={issues}
            projectIdentifier={projectIdentifier}
            onIssueClick={setSelectedIssue}
            onIssueMoved={handleIssueMoved}
            onAddColumn={() => setIsAddColumnOpen(true)}
          />
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          projectIdentifier={projectIdentifier}
          workflowStates={workflowStates}
          workspaceId={workspaceId}
          sprints={sprints}
          epics={epics}
          releases={releases}
          onClose={() => setSelectedIssue(null)}
          onUpdate={(updated) => {
            setIssues((prev) => prev.map((i) => i.id === updated.id ? updated : i));
            setSelectedIssue(updated);
          }}
        />
      )}

      {/* Add Column Dialog */}
      <AddColumnDialog
        open={isAddColumnOpen}
        onOpenChange={setIsAddColumnOpen}
        projectId={projectId}
        onSuccess={(newState) => {
          setWorkflowStates((prev) => [...prev, newState].sort((a, b) => a.position - b.position));
        }}
        nextPosition={
          workflowStates.length > 0 
            ? Math.max(...workflowStates.map((s) => s.position)) + 1 
            : 1
        }
      />
    </div>
  );
}
