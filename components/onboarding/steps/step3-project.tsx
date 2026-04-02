"use client";

import { useState } from "react";
import { useOnboarding } from "../onboarding-context";
import {
  OnboardingShell,
  NavButtons,
  OnboardingInput,
  OnboardingErrorAlert,
} from "../onboarding-ui";

// ---- Identifier auto-generator ---------------------------------------------

function toIdentifier(name: string) {
  return (
    name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .join("")
      .slice(0, 5) ||
    name
      .slice(0, 3)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
  );
}

// ---- Step 3: Create Project ------------------------------------------------

export function Step3Project() {
  const { workspaceData, projectData, setProjectData, advance, submitWorkspaceAndProject } = useOnboarding();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [identifierEdited, setIdentifierEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!identifierEdited) setIdentifier(toIdentifier(val));
    if (error) setError(null);
  };

  const handleContinue = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Project name is required.");
      return;
    }
    if (!identifier) {
      setError("Project identifier is required.");
      return;
    }

    setError(null);
    setLoading(true);

    const pd = {
      name: trimmedName,
      identifier,
      description: description.trim() || "",
    };
    setProjectData(pd);

    try {
      if (workspaceData) {
        await submitWorkspaceAndProject(pd);
      }
      advance();
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <OnboardingShell
      badge="Step 3 of 4 · Project"
      title={
        <>
          Create your first{" "}
          <span style={{ color: "oklch(0.6 0.25 25)" }}>project</span>
        </>
      }
      subtitle={
        workspaceData
          ? "Projects organise your work inside a workspace. Add issues, sprints and more."
          : "No workspace found — you can create projects from the dashboard later."
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <OnboardingInput
            id="project-name"
            label="Project Name"
            placeholder="e.g. Website Redesign"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            autoFocus
            required
            disabled={!workspaceData}
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="project-identifier"
              className="block text-white/60 text-[0.86rem] font-medium"
            >
              Identifier
            </label>
            <div className="relative">
              <input
                id="project-identifier"
                className="h-[50px] relative z-0 w-full border border-white/10 rounded-[14px] bg-white/[0.03] hover:bg-white/[0.05] text-white px-4 uppercase outline-none transition-all duration-300 placeholder:text-white/30 focus:border-[#ff1f1f]/50 focus:ring-4 focus:ring-[#ff1f1f]/20 focus:bg-white/[0.04] shadow-inner"
                placeholder="WEB"
                maxLength={5}
                value={identifier}
                onChange={(e) => {
                  setIdentifierEdited(true);
                  setIdentifier(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 5),
                  );
                }}
                disabled={!workspaceData}
              />
            </div>
            <p className="text-[0.78rem] text-orange-500/80 mt-1">
              Used to prefix issues like {identifier || "WEB"}-001
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="project-desc"
            className="block text-white/60 text-[0.86rem] font-medium"
          >
            Description{" "}
            <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span>
          </label>
          <div className="relative">
            <textarea
              id="project-desc"
              className="relative z-0 w-full border border-white/10 rounded-[14px] bg-white/[0.03] hover:bg-white/[0.05] text-white px-4 py-3 outline-none transition-all duration-300 placeholder:text-white/30 focus:border-[#ff1f1f]/50 focus:ring-4 focus:ring-[#ff1f1f]/20 focus:bg-white/[0.04] shadow-inner resize-none"
              placeholder="What is this project about?"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ paddingLeft: "0.95rem" }}
              disabled={!workspaceData}
            />
          </div>
        </div>
      </div>

      {error && <OnboardingErrorAlert message={error} />}

      <NavButtons
        onContinue={handleContinue}
        continueLabel="Continue"
        loading={loading}
        disabled={!workspaceData || !name.trim()}
      />
    </OnboardingShell>
  );
}
