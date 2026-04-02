"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { WorkflowState, StateCategoryEnum } from "@/types/index";
import axios from "axios";
import { GripVertical } from "lucide-react";

interface DraftKanbanBoardProps {
  items: WorkflowState[];
}

const COLUMNS: { id: StateCategoryEnum; title: string; accentColor: string; dotColor: string }[] = [
  { id: "todo",        title: "To Do",       accentColor: "#71717a", dotColor: "#a1a1aa" },
  { id: "in_progress", title: "In Progress", accentColor: "#3b82f6", dotColor: "#60a5fa" },
  { id: "done",        title: "Done",        accentColor: "#22c55e", dotColor: "#4ade80" },
];

export function DraftKanbanBoard({ items: initialItems }: DraftKanbanBoardProps) {
  const [items, setItems] = useState<WorkflowState[]>(initialItems);

  const grouped = (category: StateCategoryEnum) =>
    items.filter((i) => i.category === category);

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newCategory = destination.droppableId as StateCategoryEnum;

    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.id === draggableId ? { ...item, category: newCategory } : item
      )
    );

    try {
      await axios.put(`/api/workflow-states/${draggableId}`, {
        category: newCategory,
      });
    } catch (err) {
      console.error("Failed to update state:", err);
      // Revert optimistic update on failure
      setItems((prev) =>
        prev.map((item) =>
          item.id === draggableId
            ? { ...item, category: source.droppableId as StateCategoryEnum }
            : item
        )
      );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full gap-5">
        {COLUMNS.map((col) => {
          const colItems = grouped(col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col w-[350px] shrink-0 bg-[#161618] rounded-xl border border-white/5"
              style={{ borderTop: `2px solid ${col.accentColor}` }}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <h3 className="text-[0.9rem] font-semibold text-[#f0f0f0]">
                  {col.title}
                </h3>
                <span className="text-xs text-[#666] bg-white/5 px-2 py-0.5 rounded-full">
                  {colItems.length}
                </span>
              </div>

              {/* Droppable area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 flex flex-col gap-2.5 p-3 overflow-y-auto transition-colors rounded-b-xl min-h-[120px] ${snapshot.isDraggingOver
                        ? "bg-white/5"
                        : "bg-transparent"
                      }`}
                  >
                    {colItems.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex items-center justify-center h-full text-sm text-[#444] border border-dashed border-white/10 rounded-lg m-2 py-6">
                        Drop items here
                      </div>
                    )}

                    {colItems.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group bg-[#222] p-3.5 rounded-lg border transition-all duration-150 shadow-sm select-none ${snapshot.isDragging
                                ? "border-blue-400/50 shadow-lg shadow-blue-900/20 rotate-[0.5deg] scale-[1.02] bg-[#2a2a2a]"
                                : "border-white/5 hover:border-white/15"
                              }`}
                          >
                            <div className="flex items-start gap-2">
                              {/* Drag handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="mt-0.5 text-[#444] group-hover:text-[#666] transition-colors cursor-grab active:cursor-grabbing shrink-0"
                              >
                                <GripVertical size={14} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="text-[0.9rem] font-medium text-white leading-snug truncate">
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: col.dotColor }}
                                  />
                                  <span className="text-[0.7rem] text-[#666]">
                                    Draft • {new Date(item.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
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
  );
}
