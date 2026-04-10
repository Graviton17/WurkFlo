"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { WorkflowState, Issue, IssuePriority, IssueType } from "@/types/index";
import { EditIssueDialog } from "../issues/EditIssueDialog";
import { moveIssue } from "@/app/actions/issue.actions";
import { GripVertical, AlertCircle, Bug, BookOpen, CheckSquare, Layers } from "lucide-react";

interface WorkflowKanbanBoardProps {
  states: WorkflowState[];
  issues: Issue[];
  projectId: string;
  onCreateIssue: (stateId?: string) => void;
  onAddColumn: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { accent: string; dot: string }> = {
  todo: { accent: "#71717a", dot: "#a1a1aa" },
  in_progress: { accent: "#3b82f6", dot: "#60a5fa" },
  done: { accent: "#22c55e", dot: "#4ade80" },
};

const PRIORITY_COLORS: Record<IssuePriority, string> = {
  low: "#71717a",
  medium: "#eab308",
  high: "#f97316",
  urgent: "#ef4444",
};

const PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: "Low", medium: "Med", high: "High", urgent: "Urgent",
};

function TypeIcon({ type }: { type: IssueType }) {
  const cls = "shrink-0";
  if (type === "bug") return <Bug size={12} className={cls} style={{ color: "#ef4444" }} />;
  if (type === "story") return <BookOpen size={12} className={cls} style={{ color: "#a78bfa" }} />;
  return <CheckSquare size={12} className={cls} style={{ color: "#60a5fa" }} />;
}

// ── IssueCard ──────────────────────────────────────────────────────────────

function IssueCardContent({
  issue,
  dotColor,
  dragHandleProps,
  onClick,
}: {
  issue: Issue;
  dotColor: string;
  dragHandleProps?: any;
  onClick?: () => void;
}) {
  return (
    <div className="flex items-start gap-2 cursor-pointer" onClick={onClick}>
      {/* Drag handle */}
      {dragHandleProps ? (
        <div
          {...dragHandleProps}
          className="mt-0.5 text-[#444] group-hover:text-[#666] transition-colors cursor-grab active:cursor-grabbing shrink-0"
        >
          <GripVertical size={14} />
        </div>
      ) : (
        <div className="mt-0.5 text-[#444] shrink-0 opacity-50">
          <GripVertical size={14} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Title */}
        <h4 className="text-[0.88rem] font-medium text-white leading-snug">
          {issue.title}
        </h4>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {/* Sequence ID */}
          <span className="text-[0.68rem] text-[#555] font-mono">
            #{issue.sequence_id}
          </span>

          {/* Type */}
          <TypeIcon type={issue.issue_type} />

          {/* Priority pill */}
          <span
            className="text-[0.65rem] px-1.5 py-0.5 rounded font-medium"
            style={{
              color: PRIORITY_COLORS[issue.priority],
              backgroundColor: PRIORITY_COLORS[issue.priority] + "22",
            }}
          >
            {PRIORITY_LABELS[issue.priority]}
          </span>

          {/* Dot separator */}
          <span
            className="w-1.5 h-1.5 rounded-full ml-auto"
            style={{ backgroundColor: dotColor }}
          />
        </div>
      </div>
    </div>
  );
}

function IssueCard({
  issue,
  index,
  dotColor,
  onClick,
}: {
  issue: Issue;
  index: number;
  dotColor: string;
  onClick: () => void;
}) {
  return (
    <Draggable key={issue.id} draggableId={issue.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group bg-[#222] p-3.5 rounded-lg border transition-all duration-150 shadow-sm select-none ${snapshot.isDragging
            ? "border-blue-400/50 shadow-lg shadow-blue-900/20 rotate-[0.5deg] scale-[1.02] bg-[#2a2a2a]"
            : "border-white/5 hover:border-white/15"
            }`}
        >
          <IssueCardContent issue={issue} dotColor={dotColor} dragHandleProps={provided.dragHandleProps} onClick={onClick} />
        </div>
      )}
    </Draggable>
  );
}

// ── KanbanBoard ────────────────────────────────────────────────────────────

export function WorkflowKanbanBoard({
  states: initialStates,
  issues: initialIssues,
  projectId,
  onCreateIssue,
  onAddColumn,
}: WorkflowKanbanBoardProps) {
  const [states, setStates] = useState<WorkflowState[]>(initialStates);
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const issuesForState = (stateId: string) =>
    issues.filter((i) => i.state_id === stateId);

  // Issues with no state (unassigned) go to the first column
  const unassigned = issues.filter((i) => !i.state_id);

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const rawNewStateId = destination.droppableId;
    const newStateId = rawNewStateId === "unassigned" ? null : rawNewStateId;

    // Optimistic update
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === draggableId ? { ...issue, state_id: newStateId } : issue
      )
    );

    try {
      // Only call API if it actually changed state columns
      const rawSourceStateId = source.droppableId === "unassigned" ? null : source.droppableId;
      if (newStateId !== rawSourceStateId) {
        await moveIssue(draggableId, newStateId || "unassigned");
      }
    } catch (err) {
      console.error("Failed to update issue state:", err);
      // Revert on failure
      const revertStateId = source.droppableId === "unassigned" ? null : source.droppableId;
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === draggableId
            ? { ...issue, state_id: revertStateId }
            : issue
        )
      );
    }
  };


  // ── Empty state ────────────────────────────────────────────────────────

  if (states.length === 0) {
    if (issues.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-5 text-[#555]">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Layers size={28} className="text-[#666]" />
          </div>
          <div className="text-center">
            <p className="text-sm text-[#aaa] font-medium mb-1">No columns yet</p>
            <p className="text-xs text-[#555]">Create your first workflow state to start the board</p>
          </div>
          <button onClick={onAddColumn} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium text-sm">
            Add Column
          </button>
        </div>
      );
    } else {
      // Just list the issues neutrally if there's no workflow columns
      // But actually, on WorkflowStatesPage, they SHOULD create a column
      return (
        <div className="flex flex-col items-center justify-center h-full gap-5 text-[#555]">
          <p className="text-sm">You have {issues.length} issues but no columns.</p>
          <button onClick={onAddColumn} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium text-sm">
            Add Column
          </button>
        </div>
      );
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex h-full w-full gap-5 pb-4">
          {states.map((state, colIdx) => {
            const colIssues = issuesForState(state.id);

            const colors =
              CATEGORY_COLORS[state.category] ?? { accent: "#71717a", dot: "#a1a1aa" };

            return (
              <div
                key={state.id}
                className="flex flex-col w-[320px] shrink-0 bg-[#161618] rounded-xl border border-white/5"
                style={{ borderTop: `2px solid ${colors.accent}` }}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colors.dot }}
                    />
                    <h3 className="text-[0.88rem] font-semibold text-[#f0f0f0]">
                      {state.name}
                    </h3>
                    <span className="text-xs text-[#555] bg-white/5 px-2 py-0.5 rounded-full">
                      {colIssues.length}
                    </span>
                  </div>
                  <button
                    onClick={() => onCreateIssue(state.id)}
                    className="w-6 h-6 flex items-center justify-center rounded text-[#555] hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
                    title="Add issue"
                  >
                    +
                  </button>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={state.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 flex flex-col gap-2.5 p-3 overflow-y-auto transition-colors rounded-b-xl min-h-[120px] ${snapshot.isDraggingOver ? "bg-white/5" : "bg-transparent"
                        }`}
                    >
                      {colIssues.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-full text-sm text-[#444] border border-dashed border-white/10 rounded-lg m-2 py-6">
                          Drop issues here
                        </div>
                      )}

                      {colIssues.map((issue, index) => (
                        <IssueCard
                          key={issue.id}
                          issue={issue}
                          index={index}
                          dotColor={colors.dot}
                          onClick={() => setEditingIssue(issue)}
                        />
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}

        </div>
      </DragDropContext>
      {editingIssue && (
        <EditIssueDialog
          open={!!editingIssue}
          onOpenChange={(open: boolean) => {
            if (!open) setEditingIssue(null);
          }}
          issue={editingIssue}
          states={states}
          onSuccess={(updatedIssue: Issue) => {
            setIssues(prev => prev.map(i => i.id === updatedIssue.id ? updatedIssue : i));
          }}
        />
      )}
    </>
  );
}
