"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ChevronDown, FolderKanban } from "lucide-react";
import { Workspace } from "@/types/index";
import { createProjectAction } from "@/app/actions/project.actions";
import { fadeInUp } from "@/lib/motion";

function toIdentifier(name: string): string {
  return name
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 5);
}

export function NewProjectForm({ workspace }: { workspace: Workspace }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const identifier = toIdentifier(name);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await createProjectAction({
        workspace_id: workspace.id,
        name: name.trim(),
        identifier,
        ...(description.trim() && { description: description.trim() }),
      });

      if (!result.success) {
        setError(result.error ?? "Failed to create project. Please try again.");
        return;
      }

      router.push(`/dashboard/workspace/${workspace.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full items-start justify-center p-6 md:p-12 overflow-y-auto bg-[#0c0c0d] relative">
      {/* Decorative glows */}
      <div className="absolute top-10 right-1/3 w-[400px] h-[400px] bg-[#3c00ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-[#ff1f1f]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl mt-8"
      >
        <div className="relative overflow-hidden border border-white/10 rounded-2xl bg-[#0a0a0a]/70 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

          {/* Header */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase mb-3">
              <FolderKanban className="w-3.5 h-3.5" />
              New Project
            </div>
            <h1 className="text-xl font-semibold text-white">Create a new project</h1>
            <p className="text-sm text-white/50 mt-1.5 leading-relaxed">
              Your project will have its own dedicated instance and full Postgres database. An API will be set up so you can easily interact with your new database.
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="p-6 flex flex-col gap-6 border-b border-white/[0.06]">
              {/* Workspace selector */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-32 shrink-0 pt-2">
                  <label className="text-[13.5px] font-medium text-white/70">Organization</label>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="w-full sm:w-64 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-[14px] flex items-center justify-between opacity-70 cursor-not-allowed">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{workspace.name}</span>
                      <span className="text-[10px] font-semibold tracking-wide border border-white/10 rounded-full px-2 py-0.5 text-white/40">
                        FREE
                      </span>
                    </div>
                    <ChevronDown size={14} className="text-white/40" />
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.06] w-full" />

              {/* Name Input */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-32 shrink-0 pt-2">
                  <label htmlFor="project-name" className="text-[13.5px] font-medium text-white/70">
                    Name
                  </label>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    id="project-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project name"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-[14px] focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10 transition-all placeholder:text-white/30 text-white"
                    autoFocus
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-32 shrink-0 pt-2 flex flex-col">
                  <label htmlFor="project-desc" className="text-[13.5px] font-medium text-white/70">
                    Description
                  </label>
                  <span className="text-[12px] text-white/30 mt-0.5">(optional)</span>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <textarea
                    id="project-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this project about?"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-[14px] focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10 transition-all placeholder:text-white/30 text-white resize-none"
                    rows={3}
                    disabled={loading}
                  />
                </div>
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
                  Create new project
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
