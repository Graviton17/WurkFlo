"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Calendar as CalendarIcon, Timer } from "lucide-react";
import { useState } from "react";
import { createSprint } from "@/app/actions/sprint.actions";
import { Sprint, SprintStatus } from "@/types/index";

interface CreateSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess: (sprint: Sprint) => void;
}

const STATUS_OPTIONS: { label: string; value: SprintStatus }[] = [
  { label: "Planned", value: "planned" },
  { label: "Active", value: "active" },
];

export function CreateSprintDialog({
  open,
  onOpenChange,
  projectId,
  onSuccess,
}: CreateSprintDialogProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<SprintStatus>("planned");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reset form on open
  React.useEffect(() => {
    if (open) {
      setName("");
      setStartDate("");
      setEndDate("");
      setStatus("planned");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Sprint name is required");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const result = await createSprint(projectId, {
        name: name.trim(),
        start_date: startDate || null,
        end_date: endDate || null,
        status,
      });

      if (result.success && result.data) {
        onSuccess(result.data);
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to create sprint");
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
        <DialogPrimitive.Content className="fixed left-[50%] top-[40%] z-50 grid w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#161616] p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Timer size={18} className="text-blue-400" />
                <DialogPrimitive.Title className="text-lg font-semibold text-white">
                  Create a sprint
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none text-white">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>

            {/* Inputs */}
            <div className="flex flex-col px-6 py-5 gap-5 text-sm">
              <div className="space-y-1.5">
                <label className="text-[#a0a0a0] font-medium ml-1">Sprint Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sprint 1, Q3 Optimization..."
                  autoFocus
                  className="w-full bg-[#1b1b1b] border border-white/10 py-2.5 px-3 rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[#a0a0a0] font-medium ml-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#1b1b1b] border border-white/10 py-2.5 px-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[#a0a0a0] font-medium ml-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#1b1b1b] border border-white/10 py-2.5 px-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 mt-2">
                <label className="text-[#a0a0a0] font-medium ml-1">Initial Status</label>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setStatus(opt.value)}
                      className={`flex-1 py-2 rounded-lg border text-[13px] font-medium transition-all ${
                        status === opt.value
                          ? "bg-white/10 border-white/20 text-white shadow-sm"
                          : "bg-transparent border-white/5 text-[#888] hover:bg-white/5 hover:text-[#bbb]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2 border-t border-white/5 bg-[#101010] rounded-b-xl">
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create sprint"}
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
