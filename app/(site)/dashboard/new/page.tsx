"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Layers } from "lucide-react";
import { createWorkspaceAction } from "@/app/actions/workspace.actions";
import { fadeInUp } from "@/lib/motion";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewWorkspacePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = slugify(name);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await createWorkspaceAction({ name: name.trim(), slug });

      if (!result.success || !result.data) {
        setError(result.error ?? "Failed to create workspace. Please try again.");
        return;
      }

      router.push(`/dashboard/workspace/${result.data.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full items-start justify-center p-6 md:p-12 overflow-y-auto bg-[#0c0c0d] relative">
      {/* Decorative glows */}
      <div className="absolute top-10 left-1/3 w-[400px] h-[400px] bg-[#ff1f1f]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-[#3c00ff]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl mt-8"
      >
        {/* Card */}
        <div className="relative overflow-hidden border border-white/10 rounded-2xl bg-[#0a0a0a]/70 backdrop-blur-xl shadow-2xl">
          {/* Gradient line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
          
          {/* Header */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase mb-3">
              <Layers className="w-3.5 h-3.5" />
              New Workspace
            </div>
            <h1 className="text-xl font-semibold text-white">Create a new workspace</h1>
            <p className="text-sm text-white/50 mt-1.5 leading-relaxed">
              Workspaces are a way to group your projects. Each workspace can be configured with different team members.
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="p-6 flex flex-col md:flex-row gap-4 border-b border-white/[0.06]">
              <div className="md:w-32 shrink-0 pt-2">
                <label htmlFor="workspace-name" className="text-[13.5px] font-medium text-white/70">
                  Name
                </label>
              </div>
              
              <div className="flex-1 flex flex-col gap-2">
                <input
                  id="workspace-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Workspace name"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-[14px] focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10 transition-all placeholder:text-white/30 text-white"
                  autoFocus
                  disabled={loading}
                />
                <p className="text-[12.5px] text-white/40 leading-relaxed mt-0.5">
                  What&apos;s the name of your company or team? You can change this later.
                </p>
              </div>
            </div>

            {/* Form Footer */}
            <div className="p-4 bg-[#0a0a0a]/40 flex items-center justify-between rounded-b-2xl">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-[13px] font-medium rounded-full text-white/70 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-all"
                disabled={loading}
              >
                Cancel
              </button>

              <div className="flex items-center gap-4">
                {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
                <button
                  type="submit"
                  disabled={!name.trim() || loading}
                  className="px-5 py-2 text-[13px] font-medium rounded-full bg-[#009b65] hover:bg-[#009b65]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_0_20px_-6px_rgba(0,155,101,0.4)]"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  Create workspace
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
