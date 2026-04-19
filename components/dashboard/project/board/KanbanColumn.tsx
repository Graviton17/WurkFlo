"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { IssueCard } from "./IssueCard";
import type { IssueWithRelations, WorkflowState } from "@/types/index";

interface KanbanColumnProps {
  state: WorkflowState;
  issues: IssueWithRelations[];
  projectIdentifier?: string;
  onIssueClick?: (issue: IssueWithRelations) => void;
}

const CATEGORY_COLORS: Record<string, { dot: string; bg: string; border: string }> = {
  todo: {
    dot: "bg-zinc-400",
    bg: "bg-zinc-500/[0.04]",
    border: "border-zinc-500/10",
  },
  in_progress: {
    dot: "bg-amber-400",
    bg: "bg-amber-500/[0.04]",
    border: "border-amber-500/10",
  },
  done: {
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/[0.04]",
    border: "border-emerald-500/10",
  },
};

export function KanbanColumn({
  state,
  issues,
  projectIdentifier,
  onIssueClick,
}: KanbanColumnProps) {
  const colors = CATEGORY_COLORS[state.category] || CATEGORY_COLORS.todo;

  return (
    <div
      className={`flex-1 min-w-[280px] max-w-[340px] rounded-xl ${colors.bg} border ${colors.border} flex flex-col h-full`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
          <h3 className="text-[13px] font-semibold text-[#ccc] tracking-tight">
            {state.name}
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#555] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.04]">
          {issues.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={state.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-2.5 space-y-2 min-h-[120px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-[#ff1f1f]/[0.04]" : ""
            }`}
          >
            {issues.map((issue, index) => (
              <Draggable key={issue.id} draggableId={issue.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className={`${
                      dragSnapshot.isDragging
                        ? "opacity-90 rotate-1 shadow-xl"
                        : ""
                    } transition-transform`}
                  >
                    <IssueCard
                      issue={issue}
                      projectIdentifier={projectIdentifier}
                      onClick={onIssueClick}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {issues.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-full text-[12px] text-[#444] py-8">
                No issues
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
