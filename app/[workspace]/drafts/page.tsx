"use client";

import React, { useState, useEffect } from "react";
import { DraftKanbanBoard } from "@/components/drafts/DraftKanbanBoard";
import { CreateDraftDialog } from "@/components/drafts/CreateDraftDialog";
import { LayoutGrid, AlertCircle, Loader2 } from "lucide-react";
import { WorkflowState } from "@/types/index";
import axios from "axios";

interface DraftsPageProps {
  params: Promise<{
    workspace: string;
  }>;
}

export default function DraftsPage({ params }: DraftsPageProps) {
  const { workspace } = React.use(params);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [items, setItems] = useState<WorkflowState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Custom dialog state to sync
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch a project ID first (we take the first one or a default user project)
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        // Fetch projects for this workspace (workspace)
        // Note: typically we need workspace ID. Alternatively, we fetch project directly if passed, but we'll fetch all projects.
        // For Drafts, Plane usually lets you pick. We'll fetch workspace by slug first, but `workflow_states` needs project_id.
        const { data: workspacesResponse } = await axios.get('/api/workspaces');
        const workspaceItem = workspacesResponse.data?.find((w: any) => w.slug === workspace);
        
        if (workspaceItem) {
          const { data: projectsResponse } = await axios.get(`/api/projects?workspaceId=${workspaceItem.id}`);
          if (projectsResponse.data && projectsResponse.data.length > 0) {
            const pId = projectsResponse.data[0].id;
            setProjectId(pId);
            fetchDrafts(pId);
            return;
          }
        }
        setIsLoading(false);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load drafts environment.");
        setIsLoading(false);
      }
    };
    initData();
  }, [workspace]);

  const fetchDrafts = async (pId: string) => {
    setError("");
    try {
      const res = await axios.get(`/api/drafts?projectId=${pId}`);
      if (res.data.success) {
        setItems(res.data.data);
      } else {
        setError(res.data.error || "Failed to load drafts");
      }
    } catch (err) {
      setError("Failed to load drafts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = (newItem: WorkflowState) => {
    setItems((prev) => [...prev, newItem]);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1a1a1a] text-[#f0f0f0] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <LayoutGrid size={20} className="text-[#888]" />
          <h1 className="text-xl font-semibold">Drafts</h1>
        </div>
        
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors border border-white/10 shadow-sm"
        >
          Draft a work item
        </button>
      </div>

      {/* Main Kanban Content */}
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
        ) : !projectId ? (
          <div className="flex flex-col items-center justify-center h-full text-[#888]">
            <p className="text-lg mb-2 text-white">No active project found</p>
            <p className="text-sm">You must create a project in this workspace to draft items.</p>
          </div>
        ) : (
          <DraftKanbanBoard items={items} />
        )}

        {/* Empty state context text like in the background of screenshot */}
        {!isLoading && !error && items.length === 0 && projectId && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50 z-0">
             <LayoutGrid size={48} className="mb-4 text-[#888]" />
             <p className="text-lg">Try this out, start adding a work item and leave it mid-way or</p>
             <p className="text-lg mb-4">create your first draft below. 🙂</p>
          </div>
        )}
      </div>

      {projectId && (
        <CreateDraftDialog
          projectId={projectId}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
