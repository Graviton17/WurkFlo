"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Package,
  Tag,
  Loader2,
} from "lucide-react";
import type { Release, IssueWithRelations } from "@/types/index";
import { getReleaseChangelog } from "@/app/actions/release.actions";

interface ReleasesListProps {
  releases: Release[];
  projectIdentifier?: string;
}

export function ReleasesList({
  releases,
  projectIdentifier,
}: ReleasesListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [changelogMap, setChangelogMap] = useState<
    Record<string, IssueWithRelations[]>
  >({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggleRelease = async (releaseId: string) => {
    if (expandedId === releaseId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(releaseId);

    // Fetch changelog if not already loaded
    if (!changelogMap[releaseId]) {
      setLoadingId(releaseId);
      const result = await getReleaseChangelog(releaseId);
      if (result.success && result.data) {
        setChangelogMap((prev) => ({ ...prev, [releaseId]: result.data! }));
      }
      setLoadingId(null);
    }
  };

  if (releases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#555] gap-3">
        <Package size={40} className="text-[#333]" />
        <p className="text-[14px] font-medium text-[#777]">No releases yet</p>
        <p className="text-[12px] text-[#555]">
          Create releases to track milestones and generate changelogs
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {releases.map((release) => {
        const isReleased = release.release_date
          ? new Date(release.release_date) <= new Date()
          : false;
        const isExpanded = expandedId === release.id;
        const releaseIssues = changelogMap[release.id] || [];
        const isLoading = loadingId === release.id;

        return (
          <div
            key={release.id}
            className="bg-[#0a0a0a]/50 backdrop-blur-md border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.12] transition-colors"
          >
            {/* Release Header */}
            <button
              onClick={() => toggleRelease(release.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0 text-[#555] group-hover:text-[#888] transition-colors">
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isReleased
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-[#ff1f1f]/10 border border-[#ff1f1f]/20"
                  }`}
                >
                  <Tag
                    size={15}
                    className={
                      isReleased ? "text-emerald-400" : "text-[#ff1f1f]"
                    }
                  />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#ddd] flex items-center gap-2">
                    {release.version}
                    {isReleased && (
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">
                        Released
                      </span>
                    )}
                  </h3>
                  {release.release_date && (
                    <span className="flex items-center gap-1 text-[11px] text-[#555] mt-0.5">
                      <Calendar size={11} />
                      {new Date(release.release_date).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  )}
                </div>
              </div>
            </button>

            {/* Expanded Changelog */}
            {isExpanded && (
              <div className="border-t border-white/[0.04]">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2
                      size={18}
                      className="animate-spin text-[#555]"
                    />
                  </div>
                ) : releaseIssues.length === 0 ? (
                  <div className="px-5 py-6 text-[12px] text-[#555] text-center">
                    No issues linked to this release
                  </div>
                ) : (
                  releaseIssues.map((issue, idx) => {
                    const identifier = projectIdentifier
                      ? `${projectIdentifier}-${issue.sequence_id}`
                      : `#${issue.sequence_id}`;
                    return (
                      <div
                        key={issue.id}
                        className={`flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors ${
                          idx !== releaseIssues.length - 1
                            ? "border-b border-white/[0.03]"
                            : ""
                        }`}
                      >
                        <CheckCircle2
                          size={14}
                          className="text-emerald-500/60 shrink-0"
                        />
                        <span className="text-[11px] font-mono text-[#555] w-20">
                          {identifier}
                        </span>
                        <span className="text-[13px] text-[#bbb] flex-1 truncate">
                          {issue.title}
                        </span>
                        <span
                          className={`text-[10px] font-medium uppercase ${
                            issue.issue_type === "bug"
                              ? "text-red-400"
                              : "text-[#555]"
                          }`}
                        >
                          {issue.issue_type}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
