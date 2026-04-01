"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabase";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      className="relative z-10 w-full max-w-[640px] flex flex-col gap-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Brand header */}
      <motion.div
        className="flex items-center justify-center gap-2.5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          ⚡
        </div>
        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#f0f0f0",
            letterSpacing: "-0.02em",
          }}
        >
          WurkFlo
        </span>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <StepIndicator
          current={currentStep}
          onStepClick={(s) => s < currentStep && goToStep(s)}
        />
      </motion.div>

      {/* Active step card with AnimatePresence for smooth transitions */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
          >
            {stepMap[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer note */}
      <motion.p
        className="text-center text-[0.8rem] text-white/40 tracking-tight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Your progress is saved automatically. Finish setup anytime from your dashboard.
      </motion.p>
    </motion.div>
  );
}

// ---- Loading spinner --------------------------------------------------------

function LoadingSpinner() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center py-8 px-4 bg-[#0d0d0f]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.05)",
          borderTopColor: "#ff1f1f",
          borderRightColor: "#3c00ff",
        }}
        className="animate-spin"
      />
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
              const { data: workspaceData } = await supabase
                .from("workspaces")
                .select("slug")
                .eq("id", memberData.workspace_id)
                .single();

              if (workspaceData?.slug) {
                router.replace(`/${workspaceData.slug}/get-started`);
              } else {
                router.replace("/dashboard");
              }
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

  return (
    <AnimatePresence mode="wait">
      {checking || !userId ? (
        <LoadingSpinner key="loader" />
      ) : (
        <motion.div
          key="content"
          className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center py-8 px-4 bg-[#0d0d0f]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <OnboardingProvider
            userId={userId}
            initialStep={initialStep}
            initialWorkspaceId={initialWorkspaceId}
            initialFullName={initialFullName}
            onFinish={async (wid) => {
              const idToUse = wid || initialWorkspaceId;
              if (idToUse) {
                const { data } = await supabase.from("workspaces").select("slug").eq("id", idToUse).single();
                if (data?.slug) {
                  router.push(`/${data.slug}/get-started`);
                  return;
                }
              }
              router.push("/dashboard");
            }}
          >
            {/* Background glowing effects */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
            </div>

            <OnboardingContent />
          </OnboardingProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

