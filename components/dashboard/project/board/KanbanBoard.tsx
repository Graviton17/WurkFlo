"use client";

import { useState, useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import type { Issue, WorkflowState } from "@/types/index";

interface KanbanBoardProps {
  workflowStates: WorkflowState[];
  issues: Issue[];
  projectIdentifier?: string;
  onIssueClick?: (issue: Issue) => void;
  onIssueMoved?: (issueId: string, newStateId: string) => void;
}

export function KanbanBoard({
  workflowStates,
  issues: initialIssues,
  projectIdentifier,
  onIssueClick,
  onIssueMoved,
}: KanbanBoardProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);

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

      // Optimistic update
      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === draggableId
            ? { ...issue, state_id: destination.droppableId }
            : issue
        )
      );

      // Notify parent to persist
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
