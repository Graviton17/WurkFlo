"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Package,
  Tag,
  Loader2,
  Clock,
} from "lucide-react";
import type { ReleaseWithProgress, IssueWithRelations } from "@/types/index";
import { getReleaseChangelog } from "@/app/actions/release.actions";

interface ReleasesListProps {
  releases: ReleaseWithProgress[];
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

  // Sort: upcoming first, then released (by date descending)
  const sorted = [...releases].sort((a, b) => {
    const aReleased = a.release_date
      ? new Date(a.release_date) <= new Date()
      : false;
    const bReleased = b.release_date
      ? new Date(b.release_date) <= new Date()
      : false;

    if (aReleased !== bReleased) return aReleased ? 1 : -1;
    // Within same group, sort by date descending
    const aDate = a.release_date ? new Date(a.release_date).getTime() : 0;
    const bDate = b.release_date ? new Date(b.release_date).getTime() : 0;
    return bDate - aDate;
  });

  return (
    <div className="space-y-4 p-6">
      {sorted.map((release) => {
        const isReleased = release.release_date
          ? new Date(release.release_date) <= new Date()
          : false;
        const isExpanded = expandedId === release.id;
        const releaseIssues = changelogMap[release.id] || [];
        const isLoading = loadingId === release.id;

        const progress =
          release.total_issues > 0
            ? Math.round(
                (release.completed_issues / release.total_issues) * 100,
              )
            : 0;

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
                    {isReleased ? (
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">
                        Released
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/15">
                        Upcoming
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

              {/* Issue count + progress */}
              <div className="flex items-center gap-3">
                {release.total_issues > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isReleased
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                            : "bg-gradient-to-r from-[#ff1f1f] to-[#ff1f1f]/60"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#555] font-mono">
                      {progress}%
                    </span>
                  </div>
                )}
                <span className="text-[11px] text-[#555] font-mono bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.04]">
                  {release.total_issues} issues
                </span>
              </div>
            </button>

            {/* Expanded Changelog — grouped by issue type */}
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
                  (() => {
                    // Group issues by type for a proper changelog view
                    const features = releaseIssues.filter(
                      (i) => i.issue_type === "story",
                    );
                    const bugs = releaseIssues.filter(
                      (i) => i.issue_type === "bug",
                    );
                    const tasks = releaseIssues.filter(
                      (i) => i.issue_type === "task",
                    );

                    const groups = [
                      {
                        label: "Features",
                        icon: "✨",
                        issues: features,
                        color: "text-purple-400",
                      },
                      {
                        label: "Bug Fixes",
                        icon: "🐛",
                        issues: bugs,
                        color: "text-red-400",
                      },
                      {
                        label: "Tasks",
                        icon: "📋",
                        issues: tasks,
                        color: "text-[#888]",
                      },
                    ].filter((g) => g.issues.length > 0);

                    return groups.map((group, gIdx) => (
                      <div key={group.label}>
                        {/* Group header */}
                        <div className="flex items-center gap-2 px-5 py-2 bg-white/[0.01] border-b border-white/[0.04]">
                          <span className="text-[12px]">{group.icon}</span>
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-wider ${group.color}`}
                          >
                            {group.label}
                          </span>
                          <span className="text-[10px] font-mono text-[#444] bg-white/[0.03] px-1.5 py-0.5 rounded-full border border-white/[0.04]">
                            {group.issues.length}
                          </span>
                        </div>
                        {/* Group issues */}
                        {group.issues.map((issue, idx) => {
                          const identifier = projectIdentifier
                            ? `${projectIdentifier}-${issue.sequence_id}`
                            : `#${issue.sequence_id}`;
                          const stateCategory =
                            issue.workflow_state?.category || "todo";
                          const isDone = stateCategory === "done";

                          return (
                            <div
                              key={issue.id}
                              className={`flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.02] transition-colors ${
                                idx !== group.issues.length - 1 ||
                                gIdx !== groups.length - 1
                                  ? "border-b border-white/[0.03]"
                                  : ""
                              }`}
                            >
                              {/* Completion indicator */}
                              {isDone ? (
                                <CheckCircle2
                                  size={14}
                                  className="text-emerald-400 shrink-0"
                                />
                              ) : (
                                <Clock
                                  size={14}
                                  className="text-amber-400/60 shrink-0"
                                />
                              )}
                              <span className="text-[11px] font-mono text-[#555] w-20">
                                {identifier}
                              </span>
                              <span
                                className={`text-[13px] flex-1 truncate ${isDone ? "text-[#bbb]" : "text-[#888]"}`}
                              >
                                {issue.title}
                              </span>
                              {/* Completion badge */}
                              <span
                                className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                                  isDone
                                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/15"
                                    : "text-amber-400 bg-amber-500/10 border-amber-500/15"
                                }`}
                              >
                                {isDone ? "Done" : issue.workflow_state?.name || "In progress"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ));
                  })()
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
