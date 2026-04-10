"use client";

import React, { useState, useEffect } from "react";
import { EpicsList } from "@/components/dashboard/project/epics/EpicsList";
import { Loader2, AlertCircle, Plus, Milestone } from "lucide-react";
import type { EpicWithProgress } from "@/types/index";
import { getEpicsData } from "@/app/actions/epic.actions";

interface EpicsPageProps {
  params: Promise<{ id: string }>;
}

export default function EpicsPage({ params }: EpicsPageProps) {
  const { id: projectId } = React.use(params);

  const [epics, setEpics] = useState<EpicWithProgress[]>([]);
  const [projectIdentifier, setProjectIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (projectId) loadEpics(projectId);
  }, [projectId]);

  const loadEpics = async (pId: string) => {
    setError("");
    try {
      const result = await getEpicsData(pId);

      if (!result.success || !result.data) {
        setError(result.error || "Failed to load epics");
        return;
      }

      setEpics(result.data.epics);
      setProjectIdentifier(result.data.projectIdentifier);
    } catch (err) {
      setError("Failed to load epics");
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
          <Milestone size={15} className="text-indigo-400" />
          <span className="text-[13px] font-medium text-[#ccc]">Epics</span>
          <span className="text-[11px] text-[#555] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.04] font-mono">
            {epics.length}
          </span>
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#888] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.06] transition-all">
          <Plus size={14} />
          New Epic
        </button>
      </div>

      {/* Epics List */}
      <div className="flex-1 overflow-y-auto">
        <EpicsList
          epics={epics}
          projectIdentifier={projectIdentifier}
        />
      </div>
    </div>
  );
}
