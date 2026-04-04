"use client";

import { Workspace } from "@/types/index";
import { AlertTriangle, Trash2, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  workspace: Workspace;
  role: string | null;
  userId: string | null;
}

export function WorkspaceDangerZone({ workspace, role, userId }: Props) {
  const router = useRouter();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isLeaving, setIsLeaving] = useState(false);

  const isOwner = role === "owner";

  const handleDelete = async () => {
    if (deleteConfirmText !== workspace.name) return;
    
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to delete workspace");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this workspace? You will lose access immediately.")) return;
    
    setIsLeaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}/members?userId=${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to leave workspace");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setIsLeaving(false);
    }
  };

  return (
    <div className="w-full rounded-[18px] bg-red-500/[0.02] border border-red-500/10 p-6 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-red-500/10">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-white">Danger Zone</h2>
          <p className="text-sm text-red-400/80">Destructive actions for this workspace.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        
        {/* Leave Workspace Mode */}
        {!isOwner && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
             <div>
                <h4 className="text-sm font-medium text-white">Leave Workspace</h4>
                <p className="text-xs text-white/50 mt-1">
                   Revoke your own access to this workspace. You will need a new invitation to rejoin.
                </p>
             </div>
             <button
                onClick={handleLeave}
                disabled={isLeaving}
                className="flex shrink-0 items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors rounded-xl text-sm font-medium"
             >
                {isLeaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                {isLeaving ? "Leaving..." : "Leave Workspace"}
             </button>
          </div>
        )}

        {/* Delete Workspace Mode */}
        {isOwner && !showDeleteConfirm && (
           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/[0.03]">
             <div>
                <h4 className="text-sm font-medium text-white">Delete Workspace</h4>
                <p className="text-xs text-white/50 mt-1">
                   Permanently delete this workspace and all of its associated issues, members, and data.
                </p>
             </div>
             <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex shrink-0 items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-colors rounded-xl text-sm font-medium"
             >
                <Trash2 className="w-4 h-4" />
                Delete Workspace
             </button>
          </div>
        )}

        {/* Delete Workspace Modal / Inline Form */}
        {isOwner && showDeleteConfirm && (
           <div className="p-5 rounded-xl border border-red-500/30 bg-[#150a0a]">
              <h4 className="text-base font-medium text-red-500 mb-2">Are you absolutely sure?</h4>
              <p className="text-sm text-white/60 mb-4">
                 This action cannot be undone. This will permanently delete the <strong>{workspace.name}</strong> workspace, all boards, issues, and member associations.
              </p>
              
              <div className="mb-4">
                 <label className="text-sm text-white/80 block mb-2">
                    Please type <strong>{workspace.name}</strong> to confirm.
                 </label>
                 <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50"
                 />
              </div>

              <div className="flex justify-end gap-3">
                 <button
                    onClick={() => {
                       setShowDeleteConfirm(false);
                       setDeleteConfirmText("");
                    }}
                    className="px-4 py-2 text-sm text-white/70 hover:text-white bg-white/5 rounded-xl transition-colors"
                 >
                    Cancel
                 </button>
                 <button
                    onClick={handleDelete}
                    disabled={deleteConfirmText !== workspace.name || isDeleting}
                    className="flex shrink-0 items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:bg-red-600/50 transition-colors rounded-xl text-sm font-medium"
                 >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {isDeleting ? "Deleting..." : "Confirm Deletion"}
                 </button>
              </div>
           </div>
        )}

      </div>
    </div>
  );
}
