"use client";

import { useState, useCallback, useTransition } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  User,
  AlertCircle,
  GripVertical,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Timer,
  Inbox,
} from "lucide-react";
import type { IssueWithRelations, Sprint } from "@/types/index";
import { assignIssueToSprint, updateIssueProperty } from "@/app/actions/issue.actions";

interface BacklogListProps {
  issues: IssueWithRelations[];
  plannedSprints: Sprint[];
  projectId?: string;
  projectIdentifier?: string;
  onIssueClick?: (issue: IssueWithRelations) => void;
  onRefresh?: () => void;
}

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-amber-400",
  low: "bg-zinc-500",
};

const BACKLOG_DROPPABLE = "backlog-unassigned";

export function BacklogList({
  issues,
  plannedSprints,
  projectId,
  projectIdentifier,
  onIssueClick,
  onRefresh,
}: BacklogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedSprints, setCollapsedSprints] = useState<Set<string>>(
    new Set(),
  );
  const [localIssues, setLocalIssues] = useState(issues);
  const [editingEstimate, setEditingEstimate] = useState<string | null>(null);
  const [estimateValue, setEstimateValue] = useState("");
  const [isPending, startTransition] = useTransition();

  // Keep local in sync with props
  useState(() => {
    setLocalIssues(issues);
  });

  const toggleSprint = (sprintId: string) => {
    setCollapsedSprints((prev) => {
      const next = new Set(prev);
      if (next.has(sprintId)) next.delete(sprintId);
      else next.add(sprintId);
      return next;
    });
  };

  // Group issues: unassigned (sprint_id null) vs per planned sprint
  const unassignedIssues = localIssues.filter((i) => !i.sprint_id);
  const sprintGroups = plannedSprints.map((s) => ({
    sprint: s,
    issues: localIssues.filter((i) => i.sprint_id === s.id),
  }));

  // Filter
  const filterIssues = (list: IssueWithRelations[]) =>
    searchQuery
      ? list.filter((i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : list;

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { draggableId, destination, source } = result;

      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const newSprintId =
        destination.droppableId === BACKLOG_DROPPABLE
          ? null
          : destination.droppableId;

      // Optimistic update
      setLocalIssues((prev) =>
        prev.map((issue) =>
          issue.id === draggableId
            ? { ...issue, sprint_id: newSprintId }
            : issue,
        ),
      );

      // Persist
      startTransition(async () => {
        const result = await assignIssueToSprint(draggableId, newSprintId, projectId);
        if (!result.success) {
          // Revert
          setLocalIssues(issues);
        } else {
          onRefresh?.();
        }
      });
    },
    [issues, onRefresh],
  );

  const handleEstimateSubmit = (issueId: string) => {
    const value = estimateValue.trim();
    const numValue = value ? parseInt(value, 10) : null;
    setEditingEstimate(null);

    if (isNaN(numValue as any) && numValue !== null) return;

    // Optimistic
    setLocalIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, estimate: numValue } : i,
      ),
    );

    startTransition(async () => {
      await updateIssueProperty(issueId, { estimate: numValue });
    });
  };

  const renderIssueRow = (
    issue: IssueWithRelations,
    idx: number,
    total: number,
    draggableIndex: number,
  ) => {
    const identifier = projectIdentifier
      ? `${projectIdentifier}-${issue.sequence_id}`
      : `#${issue.sequence_id}`;

    return (
      <Draggable key={issue.id} draggableId={issue.id} index={draggableIndex}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`flex items-center px-6 py-3 cursor-pointer transition-colors hover:bg-white/[0.02] group ${
              idx !== total - 1 ? "border-b border-white/[0.03]" : ""
            } ${snapshot.isDragging ? "bg-[#1a1a1a] shadow-xl rounded-lg border border-white/[0.1]" : ""}`}
            onClick={() => onIssueClick?.(issue)}
          >
            <div
              className="w-8 flex items-center"
              {...provided.dragHandleProps}
            >
              <GripVertical
                size={14}
                className="text-[#333] group-hover:text-[#555] transition-colors cursor-grab"
              />
            </div>
            <div className="w-24">
              <span className="text-[11px] font-mono text-[#555]">
                {identifier}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] text-[#ccc] group-hover:text-white font-medium truncate block transition-colors">
                {issue.title}
              </span>
            </div>
            <div className="w-20 flex items-center justify-center">
              <div
                className={`w-2 h-2 rounded-full ${
                  PRIORITY_DOT[issue.priority] || PRIORITY_DOT.medium
                }`}
                title={issue.priority}
              />
            </div>
            <div
              className="w-16 text-center"
              onClick={(e) => {
                e.stopPropagation();
                setEditingEstimate(issue.id);
                setEstimateValue(
                  issue.estimate != null ? String(issue.estimate) : "",
                );
              }}
            >
              {editingEstimate === issue.id ? (
                <input
                  type="number"
                  autoFocus
                  value={estimateValue}
                  onChange={(e) => setEstimateValue(e.target.value)}
                  onBlur={() => handleEstimateSubmit(issue.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEstimateSubmit(issue.id);
                    if (e.key === "Escape") setEditingEstimate(null);
                  }}
                  className="w-12 bg-white/[0.06] border border-white/20 rounded px-1.5 py-0.5 text-[11px] font-mono text-white text-center outline-none focus:ring-1 focus:ring-white/30"
                />
              ) : (
                <span className="text-[11px] font-mono text-[#555] cursor-pointer hover:text-white hover:bg-white/[0.04] px-1.5 py-0.5 rounded transition-all">
                  {issue.estimate ?? "—"}
                </span>
              )}
            </div>
            <div className="w-20 text-center">
              <span
                className={`text-[10px] font-medium uppercase tracking-wider ${
                  issue.issue_type === "bug"
                    ? "text-red-400"
                    : issue.issue_type === "story"
                      ? "text-purple-400"
                      : "text-[#666]"
                }`}
              >
                {issue.issue_type}
              </span>
            </div>
            <div className="w-16 flex items-center justify-center">
              {issue.assignee ? (
                <div
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-[#333] to-[#222] border border-white/20 flex items-center justify-center text-[9px] font-bold text-white/70"
                  title={issue.assignee.full_name || ""}
                >
                  {(issue.assignee.full_name || "?")[0].toUpperCase()}
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#111] border border-white/20 ring-1 ring-white/10 flex items-center justify-center">
                  <User size={10} className="text-white/70" />
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-white/[0.04] shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter issues..."
            className="w-full bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] focus:border-white/20 focus:ring-1 focus:ring-white/10 rounded-lg pl-9 pr-3 py-[7px] text-[12.5px] text-[#ccc] placeholder:text-[#444] outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-1.5 text-[12px] text-[#666] hover:text-[#aaa] bg-white/[0.03] hover:bg-white/[0.06] px-3 py-[7px] rounded-lg border border-white/[0.06] transition-all">
          <Filter size={13} />
          Filter
        </button>
      </div>

      {/* Table Header */}
      <div className="flex items-center px-6 py-2 text-[10px] font-semibold text-[#444] uppercase tracking-widest border-b border-white/[0.04] shrink-0">
        <div className="w-8" />
        <div className="w-24">ID</div>
        <div className="flex-1">Title</div>
        <div className="w-20 text-center">Priority</div>
        <div className="w-16 text-center">Points</div>
        <div className="w-20 text-center">Type</div>
        <div className="w-16 text-center">Assignee</div>
      </div>

      {/* DnD Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-y-auto">
          {/* Unassigned Section */}
          <div>
            <div className="flex items-center gap-2 px-6 py-2 bg-white/[0.01] border-b border-white/[0.04]">
              <Inbox size={13} className="text-[#555]" />
              <span className="text-[11px] font-semibold text-[#666] uppercase tracking-wider">
                Unassigned
              </span>
              <span className="text-[10px] font-mono text-[#444] bg-white/[0.03] px-1.5 py-0.5 rounded-full border border-white/[0.04]">
                {filterIssues(unassignedIssues).length}
              </span>
            </div>
            <Droppable droppableId={BACKLOG_DROPPABLE}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[60px] transition-colors ${
                    snapshot.isDraggingOver
                      ? "bg-blue-500/[0.03]"
                      : ""
                  }`}
                >
                  {filterIssues(unassignedIssues).length === 0 ? (
                    <div className="flex items-center justify-center py-6 text-[12px] text-[#444]">
                      {searchQuery
                        ? "No matching issues"
                        : "Drop issues here to unassign from sprints"}
                    </div>
                  ) : (
                    filterIssues(unassignedIssues).map((issue, idx) =>
                      renderIssueRow(
                        issue,
                        idx,
                        filterIssues(unassignedIssues).length,
                        idx,
                      ),
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Sprint Sections */}
          {sprintGroups.map(({ sprint, issues: sprintIssues }) => {
            const isCollapsed = collapsedSprints.has(sprint.id);
            const filteredSprintIssues = filterIssues(sprintIssues);

            return (
              <div key={sprint.id}>
                <button
                  onClick={() => toggleSprint(sprint.id)}
                  className="w-full flex items-center gap-2 px-6 py-2 bg-white/[0.01] border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronRight size={13} className="text-[#555]" />
                  ) : (
                    <ChevronDown size={13} className="text-[#555]" />
                  )}
                  <Timer size={13} className="text-blue-400/70" />
                  <span className="text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                    {sprint.name}
                  </span>
                  <span className="text-[10px] text-blue-400 bg-blue-500/[0.08] px-1.5 py-0.5 rounded-full border border-blue-500/15 font-medium">
                    Planned
                  </span>
                  <span className="text-[10px] font-mono text-[#444] bg-white/[0.03] px-1.5 py-0.5 rounded-full border border-white/[0.04] ml-auto">
                    {filteredSprintIssues.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <Droppable droppableId={sprint.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[60px] transition-colors ${
                          snapshot.isDraggingOver
                            ? "bg-blue-500/[0.03]"
                            : ""
                        }`}
                      >
                        {filteredSprintIssues.length === 0 ? (
                          <div className="flex items-center justify-center py-6 text-[12px] text-[#444]">
                            Drop issues here to assign to {sprint.name}
                          </div>
                        ) : (
                          filteredSprintIssues.map((issue, idx) =>
                            renderIssueRow(
                              issue,
                              idx,
                              filteredSprintIssues.length,
                              idx,
                            ),
                          )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
