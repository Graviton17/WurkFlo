"use client";

import React, { useState, useEffect } from "react";
import { SprintsList } from "@/components/dashboard/project/sprints/SprintsList";
import { Loader2, AlertCircle, Plus, Timer } from "lucide-react";
import type { Sprint, Issue } from "@/types/index";
import { getProjectSprintsData } from "@/app/actions/sprint.actions";
import { CreateSprintDialog } from "@/components/dashboard/project/sprints/CreateSprintDialog";

interface SprintsPageProps {
  params: Promise<{ id: string }>;
}

export default function SprintsPage({ params }: SprintsPageProps) {
  const { id: projectId } = React.use(params);

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projectIdentifier, setProjectIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (projectId) loadSprints(projectId);
  }, [projectId]);

  const loadSprints = async (pId: string) => {
    setError("");
    try {
      const result = await getProjectSprintsData(pId);

      if (result.success && result.data) {
        setProjectIdentifier(result.data.projectIdentifier);
        setSprints(result.data.sprints);
        setIssues(result.data.issues);
      } else {
        setError(result.error || "Failed to load sprints");
      }
    } catch (err) {
      setError("Failed to load sprints");
    } finally {
      setIsLoading(false);
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
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.04] shrink-0">
        <div className="flex items-center gap-3">
          <Timer size={15} className="text-blue-400" />
          <span className="text-[13px] font-medium text-[#ccc]">Sprints</span>
          <span className="text-[11px] text-[#555] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.04] font-mono">
            {sprints.length}
          </span>
        </div>
        <button 
          onClick={() => setCreateDialogOpen(true)}
          className="flex items-center gap-1.5 text-[12px] font-medium text-[#888] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.06] transition-all"
        >
          <Plus size={14} />
          New Sprint
        </button>
      </div>

      {/* Sprints List */}
      <div className="flex-1 overflow-y-auto">
        <SprintsList
          sprints={sprints}
          issues={issues}
          projectIdentifier={projectIdentifier}
        />
      </div>

      <CreateSprintDialog
        projectId={projectId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={(newSprint) => setSprints((prev) => [...prev, newSprint])}
      />
    </div>
  );
}
