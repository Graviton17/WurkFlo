"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronDown } from "lucide-react";
import { Workspace } from "@/types/index";
import { createProjectAction } from "@/app/actions/project.actions";

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
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full items-start justify-center p-6 md:p-12 overflow-y-auto bg-[#161716]">
      <div className="w-full max-w-2xl bg-[#1c1c1e] border border-border/40 rounded-lg overflow-hidden flex flex-col mt-8 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-border/40">
          <h1 className="text-xl font-semibold text-foreground">Create a new project</h1>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Your project will have its own dedicated instance and full Postgres database. An API will be set up so you can easily interact with your new database.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 flex flex-col gap-6 border-b border-border/40">
            {/* Workspace selector (disabled, read-only) */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-32 shrink-0 pt-2">
                <label className="text-[13.5px] font-medium text-foreground">Organization</label>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="w-full sm:w-64 bg-[#161716] border border-border/40 rounded-md px-3 py-2 text-[14px] flex items-center justify-between opacity-70 cursor-not-allowed">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground">{workspace.name}</span>
                    <span className="text-[10px] font-semibold tracking-wide border border-border/40 rounded-full px-2 py-0.5 text-muted-foreground">
                      FREE
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-border/40 w-full" />

            {/* Name Input */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-32 shrink-0 pt-2">
                <label htmlFor="project-name" className="text-[13.5px] font-medium text-foreground">
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
                  className="w-full bg-[#161716] border border-border/40 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-[#009b65]/50 focus:ring-1 focus:ring-[#009b65]/50 transition-colors placeholder:text-muted-foreground/60 text-foreground"
                  autoFocus
                  disabled={loading}
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-32 shrink-0 pt-2 flex flex-col">
                <label htmlFor="project-desc" className="text-[13.5px] font-medium text-foreground">
                  Description
                </label>
                <span className="text-[12px] text-muted-foreground mt-0.5">(optional)</span>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  id="project-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this project about?"
                  className="w-full bg-[#161716] border border-border/40 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-[#009b65]/50 focus:ring-1 focus:ring-[#009b65]/50 transition-colors placeholder:text-muted-foreground/60 text-foreground resize-none"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="p-4 bg-[#161716]/60 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-[13px] font-medium rounded-md text-foreground hover:bg-secondary/80 border border-border/40 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>

            <div className="flex items-center gap-4">
              {error && <span className="text-xs text-destructive font-medium">{error}</span>}
              <button
                type="submit"
                disabled={!name.trim() || loading}
                className="px-4 py-2 text-[13px] font-medium rounded-md bg-[#009b65] hover:bg-[#009b65]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Create new project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
