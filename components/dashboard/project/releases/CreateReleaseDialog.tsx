"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Tag, Calendar } from "lucide-react";
import { useState } from "react";
import { createRelease } from "@/app/actions/release.actions";
import { Release } from "@/types/index";

interface CreateReleaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess: (release: Release) => void;
}

export function CreateReleaseDialog({
  open,
  onOpenChange,
  projectId,
  onSuccess,
}: CreateReleaseDialogProps) {
  const [version, setVersion] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (open) {
      setVersion("");
      setReleaseDate("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!version.trim()) {
      setError("Version is required");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const result = await createRelease(projectId, {
        version: version.trim(),
        release_date: releaseDate || null,
      });

      if (result.success && result.data) {
        onSuccess(result.data);
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to create release");
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
        <DialogPrimitive.Content className="fixed left-[50%] top-[40%] z-50 grid w-full max-w-[400px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#161616] p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-500/10 rounded-md">
                  <Tag size={16} className="text-emerald-400" />
                </div>
                <DialogPrimitive.Title className="text-lg font-semibold text-white">
                  Create a release
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
                <label className="text-[#a0a0a0] font-medium ml-1">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. v1.2.0, Release 4..."
                  autoFocus
                  className="w-full bg-[#1b1b1b] border border-white/10 py-2.5 px-3 rounded-lg text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium font-mono"
                />
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label className="text-[#a0a0a0] font-medium ml-1 flex items-center gap-1.5">
                  <Calendar size={13} />
                  Release Date
                </label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full bg-[#1b1b1b] border border-white/10 py-2.5 px-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-all [color-scheme:dark]"
                />
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create release"}
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
