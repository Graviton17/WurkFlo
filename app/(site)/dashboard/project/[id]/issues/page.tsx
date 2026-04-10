"use client";

import React, { useState, useEffect, useCallback } from "react";
import { IssueList } from "@/components/dashboard/issues/IssueList";
import { CreateIssueDialog } from "@/components/dashboard/issues/CreateIssueDialog";
import { KanbanSquare, AlertCircle, Loader2, Plus } from "lucide-react";
import { WorkflowState, Issue } from "@/types/index";
import axios from "axios";

interface IssuesPageProps {
  params: Promise<{ id: string }>;
}

export default function IssuesPage({ params }: IssuesPageProps) {
  const { id: projectId } = React.use(params);

  const [states, setStates] = useState<WorkflowState[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [defaultStateId, setDefaultStateId] = useState<string | undefined>();

  // ── Fetching ─────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (pId: string) => {
    setError("");
    try {
      const [statesRes, issuesRes, projectRes] = await Promise.all([
        axios.get(`/api/projects/${pId}/workflow-states`),
        axios.get(`/api/issues?projectId=${pId}`),
        axios.get(`/api/projects/${pId}`),
      ]);

      if (statesRes.data.success) setStates(statesRes.data.data ?? []);
      if (issuesRes.data.data) setIssues(issuesRes.data.data ?? []);
      if (projectRes.data.data?.workspace_id) {
        setWorkspaceId(projectRes.data.data.workspace_id);
      }
    } catch (err) {
      setError("Failed to load board data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectId) fetchData(projectId);
  }, [projectId, fetchData]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCreateSuccess = (newIssue: Issue) => {
    setIssues((prev) => [...prev, newIssue]);
    setIsDialogOpen(false);
  };

  const handleOpenCreate = (stateId?: string) => {
    setDefaultStateId(stateId);
    setIsDialogOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-[calc(100vh-52px)] w-full bg-[#1a1a1a] text-[#f0f0f0] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <KanbanSquare size={18} className="text-[#888]" />
          <h1 className="text-xl font-semibold">Issues</h1>
          {!isLoading && (
            <span className="text-xs text-[#555] ml-1">
              {states.length} columns · {issues.length} issues
            </span>
          )}
        </div>

        <button
          onClick={() => handleOpenCreate()}
          className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors border border-white/10 shadow-sm"
        >
          <Plus size={14} />
          New issue
        </button>
      </div>

      {/* Main board */}
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
          <IssueList
            states={states}
            issues={issues}
            projectId={projectId}
          />
        )}
      </div>

      {/* Create issue dialog */}
      {projectId && (
        <CreateIssueDialog
          projectId={projectId}
          workspaceId={workspaceId}
          states={states}
          defaultStateId={defaultStateId}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
