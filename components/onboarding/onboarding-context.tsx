"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type OnboardingStep = 1 | 2 | 3 | 4;

interface OnboardingState {
  currentStep: OnboardingStep;
  userId: string;
  // Step data collected along the way
  fullName: string;
  setFullName: (v: string) => void;
  workspaceId: string | null;
  setWorkspaceId: (id: string | null) => void;
  goToStep: (step: OnboardingStep) => void;
  advance: () => void;
  skip: () => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx)
    throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}

interface OnboardingProviderProps {
  children: ReactNode;
  userId: string;
  initialStep?: OnboardingStep;
  initialWorkspaceId?: string | null;
  initialFullName?: string;
  onFinish: (workspaceId: string | null) => void;
}

export function OnboardingProvider({
  children,
  userId,
  initialStep = 1,
  initialWorkspaceId = null,
  initialFullName = "",
  onFinish,
}: OnboardingProviderProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [fullName, setFullName] = useState(initialFullName);
  const [workspaceId, setWorkspaceId] = useState<string | null>(
    initialWorkspaceId,
  );

  const goToStep = (step: OnboardingStep) => {
    if (step >= 1 && step <= 4) setCurrentStep(step);
  };

  const advance = () => {
    if (currentStep < 4) {
      setCurrentStep((s) => (s + 1) as OnboardingStep);
    } else {
      onFinish(workspaceId);
    }
  };

  const skip = () => {
    advance();
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        userId,
        fullName,
        setFullName,
        workspaceId,
        setWorkspaceId,
        goToStep,
        advance,
        skip,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
