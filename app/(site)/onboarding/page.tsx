"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  OnboardingProvider,
  StepIndicator,
  Step1Username,
  Step2Workspace,
  Step3Project,
  Step4Members,
  useOnboarding,
} from "@/components/onboarding";
import type { OnboardingStep } from "@/components/onboarding";
import { logger } from "@/lib/logger";

// ---- Step renderer (inside provider, can read context) ----------------------

function OnboardingContent() {
  const { currentStep, goToStep } = useOnboarding();

  const stepMap: Record<OnboardingStep, React.ReactNode> = {
    1: <Step1Username />,
    2: <Step2Workspace />,
    3: <Step3Project />,
    4: <Step4Members />,
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
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[1.1rem] shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.1)]">
          ⚡
        </div>
        <span className="text-[1.2rem] font-bold text-[#f0f0f0] tracking-[-0.02em]">
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
        Your progress is saved automatically. Finish setup anytime from your
        dashboard.
      </motion.p>
    </motion.div>
  );
}

// ---- Loading spinner --------------------------------------------------------

function LoadingSpinner() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center py-8 px-4 bg-[#0a0a0b]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="w-12 h-12 rounded-full border-[3px] border-white/5 border-t-[#ff1f1f] border-r-[#3c00ff] animate-spin"
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
  const [initialFullName, setInitialFullName] = useState<string>("");

  useEffect(() => {
    const initData = async () => {
      try {
        // Fetch onboarding status specifically using our new GET endpoint via Axios
        const { data } = await axios.get("/api/onboarding");

        if (data?.userId) {
          setUserId(data.userId);
        }

        if (data?.hasWorkspace) {
          router.replace("/dashboard");
          return;
        }

        if (data?.fullName) {
          setInitialFullName(data.fullName);
        }

        setInitialStep(1);
      } catch (err: any) {
        logger.error({ err }, "Error checking onboarding status:");
        // Redirect to login if user session is invalid / unauthorized
        if (err?.response?.status === 401) {
          router.replace("/login");
          return;
        }
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
          className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center py-8 px-4 bg-[#0a0a0b]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <OnboardingProvider
            userId={userId}
            initialStep={initialStep}
            initialFullName={initialFullName}
            onFinish={() => router.push("/dashboard")}
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
