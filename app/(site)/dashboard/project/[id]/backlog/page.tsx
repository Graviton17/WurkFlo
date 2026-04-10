"use client";

import React, { useState, useEffect } from "react";
import { BacklogList } from "@/components/dashboard/project/backlog/BacklogList";
import { IssueDetailModal } from "@/components/dashboard/project/issue/IssueDetailModal";
import { Loader2, AlertCircle, Plus, List } from "lucide-react";
import type { Issue } from "@/types/index";
import axios from "axios";

interface BacklogPageProps {
  params: Promise<{ id: string }>;
}

export default function BacklogPage({ params }: BacklogPageProps) {
  const { id: projectId } = React.use(params);

  const [issues, setIssues] = useState<Issue[]>([]);
  const [projectIdentifier, setProjectIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    if (projectId) loadBacklog(projectId);
  }, [projectId]);

  const loadBacklog = async (pId: string) => {
    setError("");
    try {
      const [projectRes, issuesRes] = await Promise.all([
        axios.get(`/api/projects/${pId}`),
        axios.get(`/api/issues?projectId=${pId}`),
      ]);

      if (projectRes.data.success) {
        setProjectIdentifier(projectRes.data.data.identifier || "");
      }

      if (issuesRes.data.success) {
        // Filter to only backlog items (no sprint assigned)
        const backlogIssues = (issuesRes.data.data as Issue[]).filter(
          (i) => !i.sprint_id
        );
        setIssues(backlogIssues);
      }
    } catch (err) {
      setError("Failed to load backlog");
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
          <List size={15} className="text-[#666]" />
          <span className="text-[13px] font-medium text-[#ccc]">Backlog</span>
          <span className="text-[11px] text-[#555] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.04] font-mono">
            {issues.length}
          </span>
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-medium text-[#888] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 rounded-lg border border-white/[0.06] transition-all">
          <Plus size={14} />
          New Issue
        </button>
      </div>

      {/* Backlog List */}
      <div className="flex-1 overflow-hidden">
        <BacklogList
          issues={issues}
          projectIdentifier={projectIdentifier}
          onIssueClick={setSelectedIssue}
        />
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
