"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

export type OnboardingStep = 1 | 2 | 3 | 4;

export interface WorkspaceData {
  name: string;
  slug: string;
}

export interface MemberData {
  email: string;
  role: "admin" | "member" | "owner";
}

export interface ProjectData {
  name: string;
  identifier: string;
  description: string;
}

interface OnboardingState {
  currentStep: OnboardingStep;
  userId: string;
  // Step data collected along the way
  fullName: string;
  setFullName: (v: string) => void;
  workspaceData: WorkspaceData | null;
  setWorkspaceData: (data: WorkspaceData | null) => void;
  membersData: MemberData[];
  setMembersData: (data: MemberData[]) => void;
  projectData: ProjectData | null;
  setProjectData: (data: ProjectData | null) => void;
  
  goToStep: (step: OnboardingStep) => void;
  advance: () => void;
  skip: () => void;
  submitOnboarding: () => Promise<void>;
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
  initialFullName?: string;
  onFinish: () => void;
}

export function OnboardingProvider({
  children,
  userId,
  initialStep = 1,
  initialFullName = "",
  onFinish,
}: OnboardingProviderProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [fullName, setFullName] = useState(initialFullName);
  
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null);
  const [membersData, setMembersData] = useState<MemberData[]>([]);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  const goToStep = (step: OnboardingStep) => {
    if (step >= 1 && step <= 4) setCurrentStep(step);
  };

  const advance = () => {
    if (currentStep < 4) {
      setCurrentStep((s) => (s + 1) as OnboardingStep);
    } else {
      onFinish();
    }
  };

  const skip = () => {
    advance();
  };

  const submitOnboarding = async () => {
    try {
      // Using axios as requested
      const res = await axios.post("/api/onboarding", {
        userId,
        fullName,
        workspaceData,
        membersData,
        projectData,
      });

      onFinish();
    } catch (err: any) {
      throw new Error(err?.response?.data?.error || "Failed to complete onboarding.");
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        userId,
        fullName,
        setFullName,
        workspaceData,
        setWorkspaceData,
        membersData,
        setMembersData,
        projectData,
        setProjectData,
        goToStep,
        advance,
        skip,
        submitOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
