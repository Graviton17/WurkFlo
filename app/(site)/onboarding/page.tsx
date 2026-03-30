"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabase";
import {
  OnboardingProvider,
  StepIndicator,
  Step1Username,
  Step2Workspace,
  Step3Members,
  Step4Project,
  useOnboarding,
} from "@/components/onboarding";
import type { OnboardingStep } from "@/components/onboarding";

// ---- Step renderer (inside provider, can read context) ----------------------

function OnboardingContent() {
  const { currentStep, goToStep } = useOnboarding();

  const stepMap: Record<OnboardingStep, React.ReactNode> = {
    1: <Step1Username />,
    2: <Step2Workspace />,
    3: <Step3Members />,
    4: <Step4Project />,
  };

  return (
    <div className="relative z-10 w-full max-w-[640px] flex flex-col gap-8">
      {/* Brand header */}
      <div className="flex items-center justify-center gap-2.5">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "oklch(0.6 0.25 25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
          }}
        >
          ⚡
        </div>
        <span
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#f0f0f0",
            letterSpacing: "-0.01em",
          }}
        >
          WurkFlo
        </span>
      </div>

      {/* Step indicator */}
      <StepIndicator
        current={currentStep}
        onStepClick={(s) => s < currentStep && goToStep(s)}
      />

      {/* Active step card */}
      {stepMap[currentStep]}

      {/* Footer note */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.78rem",
          color: "oklch(0.45 0 0)",
        }}
      >
        Your progress is saved automatically. Finish setup anytime from your
        dashboard.
      </p>
    </div>
  );
}

// ---- Loading spinner --------------------------------------------------------

function LoadingSpinner() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center py-8 px-4 bg-auth-pattern">
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "oklch(0.6 0.25 25)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ---- Main page (auth-guarded) -----------------------------------------------

export default function OnboardingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  const [initialStep, setInitialStep] = useState<OnboardingStep>(1);
  const [initialWorkspaceId, setInitialWorkspaceId] = useState<string | null>(
    null,
  );
  const [initialFullName, setInitialFullName] = useState<string>("");

  useEffect(() => {
    const initData = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        router.replace("/login");
        return;
      }

      const uId = authData.user.id;
      setUserId(uId);

      try {
        let step: OnboardingStep = 1;

        // 1. Check if user already setup their profile
        const { data: userData } = await supabase
          .from("users")
          .select("id, full_name")
          .eq("id", uId)
          .maybeSingle();

        if (userData) {
          step = 2; // proceed to Step 2 (Workspace)
          setInitialFullName(userData.full_name || "");

          // 2. Check if a workspace already belongs to this user
          const { data: memberData } = await supabase
            .from("workspace_members")
            .select("workspace_id")
            .eq("user_id", uId)
            .limit(1)
            .maybeSingle();

          if (memberData?.workspace_id) {
            step = 4; // Skip directly to Step 4 (Projects)
            setInitialWorkspaceId(memberData.workspace_id);

            // 3. Check if any project exists inside this workspace
            const { data: projectData } = await supabase
              .from("projects")
              .select("id")
              .eq("workspace_id", memberData.workspace_id)
              .limit(1)
              .maybeSingle();

            if (projectData?.id) {
              // Entire onboarding is done
              router.replace("/dashboard");
              return; // Halt rendering the onboarding form
            }
          }
        }

        setInitialStep(step as OnboardingStep);
      } catch (err) {
        console.error("Error checking onboarding status:", err);
      }

      setChecking(false);
    };

    initData();
  }, [router]);

  if (checking || !userId) return <LoadingSpinner />;

  return (
    <OnboardingProvider
      userId={userId}
      initialStep={initialStep}
      initialWorkspaceId={initialWorkspaceId}
      initialFullName={initialFullName}
      onFinish={() => router.push("/dashboard")}
    >
      <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center py-8 px-4 bg-auth-pattern">
        {/* Background orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute rounded-full pointer-events-none blur-[95px] -top-[200px] -left-[210px] w-[440px] h-[440px] opacity-15 max-sm:w-[360px] max-sm:h-[360px] bg-[radial-gradient(circle,rgba(67,103,226,0.55)_0%,rgba(67,103,226,0)_72%)]" />
          <div className="absolute rounded-full pointer-events-none blur-[95px] -top-[180px] -right-[220px] w-[420px] h-[420px] opacity-5 max-sm:w-[360px] max-sm:h-[360px] bg-[radial-gradient(circle,rgba(76,112,224,0.45)_0%,rgba(76,112,224,0)_70%)]" />
          <div className="absolute rounded-full pointer-events-none blur-[95px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] opacity-5 max-sm:w-[500px] max-sm:h-[500px] bg-[radial-gradient(circle,rgba(86,124,232,0.5),transparent_70%)]" />
        </div>

        <OnboardingContent />
      </div>
    </OnboardingProvider>
  );
}
