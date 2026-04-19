"use client";

import { useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import { Plus } from "lucide-react";
import type { IssueWithRelations, WorkflowState } from "@/types/index";

interface KanbanBoardProps {
  workflowStates: WorkflowState[];
  issues: IssueWithRelations[];
  projectIdentifier?: string;
  onIssueClick?: (issue: IssueWithRelations) => void;
  onIssueMoved?: (issueId: string, newStateId: string) => void;
  onAddColumn?: () => void;
}

export function KanbanBoard({
  workflowStates,
  issues,
  projectIdentifier,
  onIssueClick,
  onIssueMoved,
  onAddColumn,
}: KanbanBoardProps) {
  // Sort workflow states by position
  const sortedStates = [...workflowStates].sort(
    (a, b) => a.position - b.position
  );

  const getIssuesForState = useCallback(
    (stateId: string) => issues.filter((i) => i.state_id === stateId),
    [issues]
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { draggableId, destination, source } = result;

      if (!destination) return;
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      // Notify parent to persist (parent handles optimistic state)
      onIssueMoved?.(draggableId, destination.droppableId);
    },
    [onIssueMoved]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full overflow-x-auto pb-4 px-1">
        {sortedStates.map((state) => (
          <KanbanColumn
            key={state.id}
            state={state}
            issues={getIssuesForState(state.id)}
            projectIdentifier={projectIdentifier}
            onIssueClick={onIssueClick}
          />
        ))}

        {/* Add Column Button */}
        {onAddColumn && (
          <div className="flex-shrink-0 w-[300px]">
            <button
              onClick={onAddColumn}
              className="flex items-center gap-2 px-4 py-3 w-full text-sm font-medium text-[#888] bg-white/[0.02] border border-dashed border-white/10 rounded-xl hover:text-white hover:bg-white/[0.04] hover:border-white/20 transition-all"
            >
              <Plus size={16} />
              Add Column
            </button>
          </div>
        )}
      </div>
    </DragDropContext>
  );
}

