"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Columns } from "lucide-react";
import { useState } from "react";
import { createWorkflowState } from "@/app/actions/workflow.actions";
import { WorkflowState, StateCategoryEnum } from "@/types/index";

interface AddColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess: (state: WorkflowState) => void;
  nextPosition: number;
}

const CATEGORY_OPTIONS: {
  label: string;
  value: StateCategoryEnum;
  color: string;
  description: string;
}[] = [
  { label: "Todo",        value: "todo",        color: "#71717a", description: "Work not yet started" },
  { label: "In Progress", value: "in_progress",  color: "#3b82f6", description: "Work actively being done" },
  { label: "Done",        value: "done",         color: "#22c55e", description: "Work completed" },
];

export function AddColumnDialog({
  open,
  onOpenChange,
  projectId,
  onSuccess,
  nextPosition,
}: AddColumnDialogProps) {
  const [name,         setName]         = useState("");
  const [category,     setCategory]     = useState<StateCategoryEnum>("todo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error,        setError]        = useState("");

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setName("");
      setCategory("todo");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Column name is required"); return; }
    setIsSubmitting(true);
    setError("");

    try {
      const result = await createWorkflowState(projectId, {
        name:     name.trim(),
        category,
        position: nextPosition,
      });

      if (result.success && result.data) {
        onSuccess(result.data as WorkflowState);
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to create column");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCat = CATEGORY_OPTIONS.find((c) => c.value === category)!;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[40%] z-50 w-full max-w-[480px] translate-x-[-50%] translate-y-[-50%] border border-white/10 bg-[#161616] p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-xl">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Columns size={16} className="text-[#888]" />
              <h2 className="text-base font-semibold text-white">Add Column</h2>
            </div>
            <DialogPrimitive.Close className="rounded-sm opacity-70 hover:opacity-100 transition-opacity text-white">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          {/* Body */}
          <div className="flex flex-col px-6 py-5 gap-5">
            {/* Column name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888] font-medium">Column Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="e.g. In Review, Backlog…"
                autoFocus
                className="w-full bg-[#1b1b1b] border border-white/10 py-2.5 px-3.5 rounded-lg text-sm text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888] font-medium">Category</label>
              <div className="flex gap-2">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCategory(opt.value)}
                    className={`flex-1 flex flex-col items-start gap-1 px-3 py-2.5 rounded-lg border text-left transition-all ${
                      category === opt.value
                        ? "border-white/20 bg-white/5"
                        : "border-white/5 bg-[#1b1b1b] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: opt.color }}
                      />
                      <span className="text-xs font-medium text-white">{opt.label}</span>
                    </div>
                    <span className="text-[0.65rem] text-[#555] leading-tight">{opt.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 bg-[#101010] rounded-b-xl">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#3f76ff] hover:bg-[#3566e5] text-white text-sm font-medium rounded-md transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Creating…" : "Add Column"}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
