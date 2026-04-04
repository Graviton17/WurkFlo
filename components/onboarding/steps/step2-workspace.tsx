"use client";

import { useState, useEffect } from "react";
import { useOnboarding } from "../onboarding-context";
import {
  OnboardingShell,
  NavButtons,
  OnboardingInput,
  OnboardingErrorAlert,
} from "../onboarding-ui";

// ---- Slug preview ----------------------------------------------------------

function SlugPreview({ slug }: { slug: string }) {
  if (!slug) return null;
  return (
    <div className="flex items-center gap-1 text-[0.82rem] text-white/60 mt-1.5">
      <span>app.wurkflo.com/</span>
      <span className="text-[#ff1f1f] font-semibold">{slug}</span>
    </div>
  );
}

// ---- Slug generator --------------------------------------------------------

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

// ---- Step 2: Workspace Creation --------------------------------------------

export function Step2Workspace() {
  const { workspaceData, setWorkspaceData, advance, workspaceCreateError, setWorkspaceCreateError } = useOnboarding();
  const [name, setName] = useState(workspaceData?.name || "");
  const [slug, setSlug] = useState(workspaceData?.slug || "");
  const [slugEdited, setSlugEdited] = useState(!!workspaceData?.slug);
  const [error, setError] = useState<string | null>(workspaceCreateError || null);

  useEffect(() => {
    if (workspaceCreateError) {
      setError(workspaceCreateError);
      setWorkspaceCreateError(null);
    }
  }, [workspaceCreateError, setWorkspaceCreateError]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugEdited) setSlug(toSlug(val));
    if (error) setError(null);
  };

  const handleSlugChange = (val: string) => {
    setSlugEdited(true);
    setSlug(toSlug(val));
  };

  const handleContinue = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Workspace name is required.");
      return;
    }
    if (!slug) {
      setError("Workspace URL is required.");
      return;
    }

    setWorkspaceData({ name: trimmedName, slug });
    advance();
  };

  return (
    <OnboardingShell
      badge="Step 2 of 4 · Workspace"
      title={
        <>
          Create your{" "}
          <span style={{ color: "oklch(0.6 0.25 25)" }}>workspace</span>
        </>
      }
      subtitle="A workspace is where your team collaborates. You can rename or adjust it later."
    >
      <div className="space-y-5">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <OnboardingInput
            id="workspace-name"
            label="Workspace Name"
            placeholder="e.g. Acme Corp"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            autoFocus
            required
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="workspace-slug"
              className="block text-white/60 text-[0.86rem] font-medium"
            >
              URL Slug
            </label>
            <div className="relative">
              <input
                id="workspace-slug"
                className="h-[50px] relative z-0 w-full border border-white/10 rounded-[14px] bg-white/[0.03] hover:bg-white/[0.05] text-white px-4 py-3 outline-none transition-all duration-300 placeholder:text-white/30 focus:border-[#ff1f1f]/50 focus:ring-4 focus:ring-[#ff1f1f]/20 focus:bg-white/[0.04] shadow-inner"
                placeholder="acme-corp"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
              />
            </div>
            <SlugPreview slug={slug} />
          </div>
        </div>
      </div>

      {error && <OnboardingErrorAlert message={error} />}

      <NavButtons
        onContinue={handleContinue}
        continueLabel="Create Workspace"
        disabled={!name.trim()}
      />
    </OnboardingShell>
  );
}
