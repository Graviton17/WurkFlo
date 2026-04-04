"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? "Failed to create workspace. Please try again.");
        return;
      }

      router.push(`/dashboard/workspace/${json.data.id}`);
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
          <h1 className="text-xl font-semibold text-foreground">Create a new workspace</h1>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Workspaces are a way to group your projects. Each workspace can be configured with different team members.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 flex flex-col md:flex-row gap-4 border-b border-border/40">
            {/* Left Column Label */}
            <div className="md:w-32 shrink-0 pt-2">
              <label htmlFor="workspace-name" className="text-[13.5px] font-medium text-foreground">
                Name
              </label>
            </div>
            
            {/* Right Column Input */}
            <div className="flex-1 flex flex-col gap-2">
              <input
                id="workspace-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workspace name"
                className="w-full bg-[#161716] border border-border/40 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors placeholder:text-muted-foreground/60 text-foreground"
                autoFocus
                disabled={loading}
              />
              <p className="text-[12.5px] text-muted-foreground leading-relaxed mt-0.5">
                What&apos;s the name of your company or team? You can change this later.
              </p>
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
                Create workspace
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
