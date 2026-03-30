"use client";

import { useState, KeyboardEvent } from "react";
import { X, UserPlus } from "lucide-react";
import { useOnboarding } from "../onboarding-context";
import {
  OnboardingShell,
  NavButtons,
  OnboardingErrorAlert,
} from "../onboarding-ui";

// ---- Types -----------------------------------------------------------------

type MemberRole = "member" | "admin";

interface MemberEntry {
  email: string;
  role: MemberRole;
}

// ---- Member Tag pill -------------------------------------------------------

function MemberTag({
  entry,
  onRemove,
}: {
  entry: MemberEntry;
  onRemove: () => void;
}) {
  return (
    <div className="onboarding-tag">
      <span>{entry.email}</span>
      <span
        style={{
          fontSize: "0.72rem",
          padding: "0.1rem 0.4rem",
          borderRadius: "100px",
          background: "rgba(255,255,255,0.06)",
          color: "var(--auth-text-muted)",
        }}
      >
        {entry.role}
      </span>
      <button
        type="button"
        className="onboarding-tag-remove"
        onClick={onRemove}
        aria-label={`Remove ${entry.email}`}
      >
        <X size={10} strokeWidth={3} />
      </button>
    </div>
  );
}

// ---- Step 3: Add Members ---------------------------------------------------

export function Step3Members() {
  const { workspaceId, advance, skip } = useOnboarding();
  const [emailInput, setEmailInput] = useState("");
  const [role, setRole] = useState<MemberRole>("member");
  const [members, setMembers] = useState<MemberEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const addMember = () => {
    const email = emailInput.trim().toLowerCase();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (members.some((m) => m.email === email)) {
      setError("This email has already been added.");
      return;
    }
    setMembers((prev) => [...prev, { email, role }]);
    setEmailInput("");
    setError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMember();
    }
  };

  const removeMember = (email: string) => {
    setMembers((prev) => prev.filter((m) => m.email !== email));
  };

  const handleContinue = async () => {
    // If no workspace was created, just skip this step
    if (!workspaceId) {
      advance();
      return;
    }

    // If no members added, just advance
    if (members.length === 0) {
      advance();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all users to look up by email
      const usersRes = await fetch("/api/users");
      const usersData = await usersRes.json();
      const allUsers: { id: string; email: string }[] = usersData?.data ?? [];

      const results = await Promise.allSettled(
        members.map(async (m) => {
          const match = allUsers.find(
            (u) => u.email.toLowerCase() === m.email.toLowerCase(),
          );
          if (!match) throw new Error(`No account found for ${m.email}`);
          return fetch(`/api/workspaces/${workspaceId}/members`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: match.id, role: m.role }),
          });
        }),
      );

      const failed = results.filter(
        (r) => r.status === "rejected",
      ) as PromiseRejectedResult[];
      setLoading(false);

      if (failed.length > 0) {
        const msgs = failed.map((f) => f.reason?.message ?? "Unknown error");
        setError(`Some invites failed: ${msgs.join(", ")}`);
        return;
      }

      advance();
    } catch (err: unknown) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <OnboardingShell
      badge="Step 3 of 4 · Members"
      title={
        <>
          Invite your <span style={{ color: "oklch(0.6 0.25 25)" }}>team</span>
        </>
      }
      subtitle={
        workspaceId
          ? "Add teammates to your workspace. You can always invite more people later."
          : "No workspace was created — you can still set up your team later."
      }
    >
      <div className="space-y-4">
        {/* Email + Role input row */}
        <div className="onboarding-field">
          <label htmlFor="member-email" className="onboarding-label">
            Email address
          </label>
          <div className="flex gap-2">
            <div className="auth-input-wrapper flex-1">
              <input
                id="member-email"
                className="h-[50px] relative z-0 w-full border border-white/10 rounded-[14px] bg-white/[0.03] hover:bg-white/[0.05] text-white px-4 outline-none transition-all duration-300 placeholder:text-white/30 focus:border-[#ff1f1f]/50 focus:ring-4 focus:ring-[#ff1f1f]/20 focus:bg-white/[0.04] shadow-inner"
                type="email"
                placeholder="teammate@company.com"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={handleKeyDown}
                disabled={!workspaceId}
              />
            </div>
            <select
              className="h-[50px] border border-white/10 rounded-[14px] bg-white/[0.03] hover:bg-white/[0.05] text-white px-4 outline-none transition-all duration-300 focus:border-[#ff1f1f]/50 focus:ring-4 focus:ring-[#ff1f1f]/20"
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              disabled={!workspaceId}
              aria-label="Member role"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="button"
              onClick={addMember}
              disabled={!workspaceId || !emailInput.trim()}
              className="h-[50px] w-[50px] flex items-center justify-center border-none bg-white text-black transition-all duration-200 hover:bg-gray-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] disabled:opacity-50 rounded-[14px]"
              aria-label="Add member"
            >
              <UserPlus size={18} />
            </button>
          </div>
          <p className="onboarding-hint">
            Press Enter or click + to add. Invited users must have an existing
            account.
          </p>
        </div>

        {/* Tag pills */}
        {members.length > 0 && (
          <div className="onboarding-tags">
            {members.map((m) => (
              <MemberTag
                key={m.email}
                entry={m}
                onRemove={() => removeMember(m.email)}
              />
            ))}
          </div>
        )}

        {members.length === 0 && workspaceId && (
          <div
            style={{
              borderRadius: 12,
              border: "1px dashed rgba(255,255,255,0.1)",
              padding: "1.5rem",
              textAlign: "center",
              color: "var(--auth-text-muted)",
              fontSize: "0.87rem",
            }}
          >
            No members added yet. Add emails above to invite teammates.
          </div>
        )}
      </div>

      {error && <OnboardingErrorAlert message={error} />}

      <NavButtons
        onContinue={handleContinue}
        onSkip={skip}
        loading={loading}
        continueLabel={
          members.length > 0
            ? `Invite ${members.length} member${members.length > 1 ? "s" : ""}`
            : "Continue"
        }
      />
    </OnboardingShell>
  );
}
