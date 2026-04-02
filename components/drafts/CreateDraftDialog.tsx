"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bot, ListTodo, User2, Tag, Calendar, LayoutDashboard, Component, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { WorkflowState } from "@/types/index";

interface CreateDraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess: (item: WorkflowState) => void;
}

export function CreateDraftDialog({ open, onOpenChange, projectId, onSuccess }: CreateDraftDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"todo" | "in_progress" | "done">("todo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createMore, setCreateMore] = useState(false);
  const [error, setError] = useState("");

  // Reset state when opening
  React.useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      const { data } = await axios.post("/api/drafts", {
        projectId,
        title,
        description,
        category,
      });

      if (data.success) {
        onSuccess(data.data);
        if (!createMore) {
          onOpenChange(false);
        } else {
          setTitle("");
          setDescription("");
        }
      } else {
        setError(data.error || "Failed to create draft");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[40%] z-50 grid w-full max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#161616] p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl">
          
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">Create a draft</h2>
              <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-white">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>

            {/* Context bar */}
            <div className="flex items-center gap-2 px-6 py-3">
              <div className="flex items-center gap-1.5 bg-[#202020] border border-white/10 rounded-md px-2 py-1">
                <span className="text-amber-500 text-xs">✨</span>
                <span className="text-xs text-[#a0a0a0]">Harshi</span>
                <span className="text-xs text-[#666] mx-0.5">›</span>
                <div className="w-4 h-4 bg-white/5 rounded flex items-center justify-center">
                  <LayoutDashboard className="w-2.5 h-2.5 text-[#a0a0a0]" />
                </div>
              </div>
            </div>

            {/* Inputs Form */}
            <div className="flex flex-col px-6 py-2 gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-[#1b1b1b] border border-white/10 py-3 px-4 rounded-lg text-[15px] text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all font-medium"
              />

              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Click to add description"
                  className="w-full h-[180px] bg-[#1b1b1b] border border-white/10 py-3 px-4 rounded-lg text-sm text-[#ccc] placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all resize-none"
                />
                <button className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[#888] hover:text-white transition-colors">
                  <Bot size={14} />
                  <span className="text-xs font-medium">AI</span>
                </button>
              </div>

              {error && <div className="text-red-400 text-sm mt-1 mb-1">{error}</div>}

              {/* Action tags (Visual mock representation as requested via screenshot) */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {/* Status Dropdown / Mock */}
                <button
                  onClick={() => setCategory(category === "todo" ? "in_progress" : category === "in_progress" ? "done" : "todo")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-white/10 rounded-md text-xs text-[#a0a0a0] transition-colors"
                >
                  <ListTodo size={14} className={category === "todo" ? "text-gray-400" : category === "in_progress" ? "text-blue-400" : "text-green-400"} />
                  <span className="capitalize">{category.replace('_', ' ')}</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-white/10 rounded-md text-xs text-[#a0a0a0] transition-colors">
                  <span className="w-3 h-3 rounded-full border border-dashed border-[#888]"></span> None
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-white/10 rounded-md text-xs text-[#a0a0a0] transition-colors">
                  <User2 size={13} /> Assignees
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-white/10 rounded-md text-xs text-[#a0a0a0] transition-colors">
                  <Tag size={13} /> Labels
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-white/10 rounded-md text-xs text-[#a0a0a0] transition-colors">
                  <Calendar size={13} /> Start date
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-white/10 rounded-md text-xs text-[#a0a0a0] transition-colors">
                  <Calendar size={13} /> Due date
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-white/10 rounded-md text-xs text-[#a0a0a0] transition-colors">
                  <Component size={13} /> Cycle
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-white/10 rounded-md text-xs text-[#a0a0a0] transition-colors">
                  <LayoutDashboard size={13} /> Modules
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] border border-white/10 rounded-md text-xs text-[#a0a0a0] transition-colors">
                  <LinkIcon size={13} /> Add parent
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 mt-6 border-t border-white/5 bg-[#101010] rounded-b-xl">
              <div className="flex items-center gap-2 mr-auto">
                {/* Next UI style switch */}
                <button 
                  type="button"
                  onClick={() => setCreateMore(!createMore)}
                  className={`w-8 h-4 rounded-full relative transition-colors ${createMore ? "bg-blue-500" : "bg-white/20"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${createMore ? "translate-x-4" : "translate-x-0"}`} />
                </button>
                <span className="text-xs text-[#888]">Create more</span>
              </div>
              
              <button
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm font-medium text-white hover:bg-white/5 rounded-md transition-colors border border-transparent"
              >
                Discard
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#3f76ff] hover:bg-[#3566e5] text-white text-sm font-medium rounded-md transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? "Saving..." : "Save to Drafts"}
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
