"use client";

import React, { useState, useEffect } from "react";
import { ReleasesList } from "@/components/dashboard/project/releases/ReleasesList";
import { Loader2, AlertCircle, Plus, Tag } from "lucide-react";
import type { Release } from "@/types/index";
import { getReleasesData } from "@/app/actions/release.actions";
import { CreateReleaseDialog } from "@/components/dashboard/project/releases/CreateReleaseDialog";

interface ReleasesPageProps {
  params: Promise<{ id: string }>;
}

export default function ReleasesPage({ params }: ReleasesPageProps) {
  const { id: projectId } = React.use(params);

  const [releases, setReleases] = useState<Release[]>([]);
  const [projectIdentifier, setProjectIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (projectId) loadReleases(projectId);
  }, [projectId]);

  const loadReleases = async (pId: string) => {
    setError("");
    try {
      const result = await getReleasesData(pId);

      if (!result.success || !result.data) {
        setError(result.error || "Failed to load releases");
        return;
      }

      setReleases(result.data.releases);
      setProjectIdentifier(result.data.projectIdentifier);
    } catch (err) {
      setError("Failed to load releases");
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
          <Tag size={15} className="text-emerald-400" />
          <span className="text-[13px] font-medium text-[#ccc]">Releases</span>
          <span className="text-[11px] text-[#555] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.04] font-mono">
            {releases.length}
          </span>
        </div>
        <button 
          onClick={() => setCreateDialogOpen(true)}
          className="flex items-center gap-1.5 text-[12px] font-medium text-[#888] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.06] transition-all"
        >
          <Plus size={14} />
          New Release
        </button>
      </div>

      {/* Releases List */}
      <div className="flex-1 overflow-y-auto">
        <ReleasesList
          releases={releases}
          projectIdentifier={projectIdentifier}
        />
      </div>

      <CreateReleaseDialog
        projectId={projectId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={(newRelease) => setReleases((prev) => [...prev, newRelease])}
      />
    </div>
  );
}
