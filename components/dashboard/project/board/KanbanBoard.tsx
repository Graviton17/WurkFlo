"use client";

import { useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import type { IssueWithRelations, WorkflowState } from "@/types/index";

interface KanbanBoardProps {
  workflowStates: WorkflowState[];
  issues: IssueWithRelations[];
  projectIdentifier?: string;
  onIssueClick?: (issue: IssueWithRelations) => void;
  onIssueMoved?: (issueId: string, newStateId: string) => void;
}

export function KanbanBoard({
  workflowStates,
  issues,
  projectIdentifier,
  onIssueClick,
  onIssueMoved,
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
      </div>
    </DragDropContext>
  );
}

