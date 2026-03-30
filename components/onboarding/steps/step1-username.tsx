"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { useOnboarding } from "../onboarding-context";
import {
  OnboardingShell,
  NavButtons,
  OnboardingInput,
  OnboardingErrorAlert,
} from "../onboarding-ui";

// ---- Avatar Preview --------------------------------------------------------

function AvatarPreview({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 mb-6 p-4 rounded-xl border border-white/8 bg-white/3">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
        style={{
          background: initials
            ? "linear-gradient(135deg, oklch(0.6 0.25 25) 0%, oklch(0.5 0.2 280) 100%)"
            : "rgba(255,255,255,0.07)",
        }}
      >
        {initials || <User className="h-7 w-7 text-white/40" />}
      </div>
      <div>
        <p className="text-white font-semibold text-base leading-tight">
          {name.trim() || "Your Name"}
        </p>
        <p className="text-sm mt-0.5 text-white/60">
          This is how you'll appear in workspaces
        </p>
      </div>
    </div>
  );
}

// ---- Step 1: Profile Setup -------------------------------------------------

export function Step1Username() {
  const { fullName, setFullName, userId, advance } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    const trimmed = fullName.trim();
    if (!trimmed) {
      setError("Please enter your full name to continue.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to save your name.");
      }

      advance();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingShell
      badge="Step 1 of 4 · Profile"
      title="What should we call you?"
      subtitle="Set up your profile so teammates can recognise you across workspaces."
    >
      <AvatarPreview name={fullName} />

      <div className="space-y-4">
        <OnboardingInput
          id="full-name"
          label="Full Name"
          type="text"
          placeholder="e.g. Alex Johnson"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (error) setError(null);
          }}
          autoFocus
          autoComplete="name"
          required
        />
      </div>

      {error && <OnboardingErrorAlert message={error} />}

      <NavButtons
        onContinue={handleContinue}
        loading={loading}
        continueLabel="Save & Continue"
        disabled={!fullName.trim()}
      />
    </OnboardingShell>
  );
}
