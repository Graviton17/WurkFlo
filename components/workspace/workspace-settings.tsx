"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Trash2, AlertTriangle } from "lucide-react";
import { updateWorkspaceAction, deleteWorkspaceAction } from "@/app/actions/workspace.actions";
import { Workspace } from "@/types/index";

export function WorkspaceSettings({ workspace }: { workspace: Workspace }) {
  const router = useRouter();
  const [name, setName] = useState(workspace.name);
  const [slug, setSlug] = useState(workspace.slug);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ text: "", type: "" });
    startTransition(async () => {
      const res = await updateWorkspaceAction(workspace.id, { name, slug });
      if (res.success) {
        setStatusMsg({ text: "Workspace updated successfully!", type: "success" });
        router.refresh();
      } else {
        setStatusMsg({ text: res.error || "Failed to update workspace", type: "error" });
      }
    });
  };

  const handleDelete = () => {
    if (deleteConfirm !== workspace.name) return;

    setStatusMsg({ text: "", type: "" });
    startTransition(async () => {
      const res = await deleteWorkspaceAction(workspace.id);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setStatusMsg({ text: res.error || "Failed to delete workspace", type: "error" });
      }
    });
  };

  const hasChanges = name !== workspace.name || slug !== workspace.slug;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#e7e4ec]">
          Workspace Settings
        </h1>
        <p className="mt-2 text-sm text-[#acaab1]">
          Manage your workspace configuration and preferences.
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-[#1f1f24] rounded-2xl border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-8">
        <h2 className="text-lg font-medium text-[#e7e4ec] mb-6">General Information</h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#acaab1] text-xs uppercase tracking-wider">Workspace Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Team"
              className="bg-[#0e0e10] border-white/10 text-[#e7e4ec] placeholder:text-[#565457] focus-visible:ring-[#c6c6c7]/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-[#acaab1] text-xs uppercase tracking-wider">Workspace URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-[#565457] text-sm hidden sm:inline">wurkflo.com/</span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                placeholder="my-team"
                className="bg-[#0e0e10] border-white/10 text-[#e7e4ec] placeholder:text-[#565457] focus-visible:ring-[#c6c6c7]/50"
              />
            </div>
            <p className="text-[10px] text-[#565457]">Lowercase letters, numbers, and hyphens only.</p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="text-sm">
              {statusMsg.text && !statusMsg.text.includes("Only") && (
                <span className={statusMsg.type === "error" ? "text-[#ec7c8a]" : "text-green-500"}>
                  {statusMsg.text}
                </span>
              )}
            </div>
            <Button
              type="submit"
              disabled={isPending || !hasChanges}
              className="bg-[#c6c6c7] hover:bg-[#e2e2e2] text-[#3f4041] transition-all duration-200 shadow-[0_0_15px_rgba(198,198,199,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#1f1f24] rounded-2xl border border-[#ec7c8a]/20 shadow-[inset_0_1px_0_rgba(236,124,138,0.05)] p-8">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-[#ec7c8a]" />
          <h2 className="text-lg font-medium text-[#ec7c8a]">Danger Zone</h2>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-[#e7e4ec] font-medium">Delete Workspace</p>
            <p className="text-xs text-[#acaab1]">
              Permanently remove this workspace and all its data. This action cannot be undone.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="deleteConfirm" className="text-[#acaab1] text-[10px] uppercase tracking-wider">
                Type <span className="text-[#e7e4ec] select-all font-mono">"{workspace.name}"</span> to confirm deletion
              </Label>
              <Input
                id="deleteConfirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Enter workspace name"
                className="bg-[#0e0e10] border-[#ec7c8a]/20 text-[#e7e4ec] placeholder:text-[#565457] focus-visible:ring-[#ec7c8a]/30"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                {statusMsg.text && statusMsg.text.includes("Only") && (
                  <span className="text-[#ec7c8a]">{statusMsg.text}</span>
                )}
              </div>
              <Button
                onClick={handleDelete}
                disabled={isPending || deleteConfirm !== workspace.name}
                className="bg-[#ec7c8a] hover:bg-[#ff8a9a] text-white transition-all duration-200 shadow-[0_0_15px_rgba(236,124,138,0.2)] disabled:opacity-30 disabled:shadow-none"
              >
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Delete Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
