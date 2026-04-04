"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Workspace } from "@/types/index";
import { Loader2, Settings, Link as LinkIcon, Hash } from "lucide-react";
import { useState } from "react";

const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface Props {
  workspace: Workspace;
  role: string | null;
  onUpdate: () => void;
}

export function WorkspaceSettingsForm({ workspace, role, onUpdate }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canEdit = role === "admin" || role === "owner";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace.name,
      slug: workspace.slug,
    },
  });

  const onSubmit = async (data: WorkspaceFormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to update workspace");
      }

      setSuccess(true);
      onUpdate();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-[18px] bg-white/[0.02] border border-white/[0.05] p-6 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-white/[0.04]">
          <Settings className="w-5 h-5 text-white/70" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-white">General Information</h2>
          <p className="text-sm text-white/50">Update your workspace details and URL config.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div className="space-y-4">
          <div>
             <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-2">
                <Hash className="w-4 h-4" /> Workspace ID
             </label>
             <input
                disabled
                value={workspace.id}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white/50 cursor-not-allowed focus:outline-none"
             />
          </div>

          <div>
             <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-2">
                Workspace Name
             </label>
             <input
                disabled={!canEdit}
                {...register("name")}
                placeholder="My Organization"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
             />
             {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
          </div>

          <div>
             <label className="text-sm font-medium text-white/70 mb-1.5 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> URL Slug
             </label>
             <input
                disabled={!canEdit}
                {...register("slug")}
                placeholder="my-organization"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
             />
             {errors.slug && <p className="text-red-400 text-xs mt-1.5">{errors.slug.message}</p>}
             <p className="text-xs text-white/40 mt-2">
                This forms your workspace URL: <span className="text-white/60">https://wurkflo.app/workspace/{workspace.slug || "new-slug"}</span>
             </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Workspace updated successfully!
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={!canEdit || isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium text-sm transition-colors"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
