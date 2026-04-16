"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Milestone, Calendar } from "lucide-react";
import { useState } from "react";
import { createEpic } from "@/app/actions/epic.actions";
import { Epic } from "@/types/index";

interface CreateEpicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess: (epic: Epic) => void;
}

export function CreateEpicDialog({
  open,
  onOpenChange,
  projectId,
  onSuccess,
}: CreateEpicDialogProps) {
  const [name, setName] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (open) {
      setName("");
      setTargetDate("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Epic name is required");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const result = await createEpic(projectId, {
        name: name.trim(),
        target_date: targetDate || null,
      });

      if (result.success && result.data) {
        onSuccess(result.data);
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to create epic");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[40%] z-50 grid w-full max-w-[450px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#ff1f1f]/10 rounded-md">
                  <Milestone size={16} className="text-[#ff1f1f]" />
                </div>
                <DialogPrimitive.Title className="text-lg font-semibold text-white">
                  Create an epic
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none text-white">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>

            {/* Inputs */}
            <div className="flex flex-col px-6 py-5 gap-5 text-sm">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[#a0a0a0] font-medium ml-1">Epic Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Authentication Overhaul"
                  autoFocus
                  className="w-full bg-white/[0.03] border border-white/10 py-2.5 px-3 rounded-xl text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-[#a0a0a0] font-medium ml-1 flex items-center gap-1.5">
                  <Calendar size={13} />
                  Target Completion Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 py-2.5 px-3 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all [color-scheme:dark]"
                />
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06] bg-[#0a0a0a]/60 rounded-b-2xl">
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] rounded-full transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#009b65] hover:bg-[#009b65]/90 text-white text-sm font-medium rounded-full transition-all shadow-[0_0_20px_-6px_rgba(0,155,101,0.4)] disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create epic"}
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
