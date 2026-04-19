"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CreateIssueDialog } from "./CreateIssueDialog";
import type { WorkflowState, Issue, Sprint, Epic, Release } from "@/types/index";
import { useRouter } from "next/navigation";

interface CreateIssueContextType {
  openCreateIssue: (defaultStateId?: string) => void;
}

const CreateIssueContext = createContext<CreateIssueContextType | null>(null);

export function useCreateIssue() {
  const context = useContext(CreateIssueContext);
  if (!context) {
    throw new Error("useCreateIssue must be used within a CreateIssueProvider");
  }
  return context;
}

interface CreateIssueProviderProps {
  children: React.ReactNode;
  projectId: string;
  workspaceId: string;
  states: WorkflowState[];
  sprints: Sprint[];
  epics: Epic[];
  releases: Release[];
}

export function CreateIssueProvider({
  children,
  projectId,
  workspaceId,
  states,
  sprints,
  epics,
  releases,
}: CreateIssueProviderProps) {
  const [open, setOpen] = useState(false);
  const [defaultStateId, setDefaultStateId] = useState<string | undefined>();
  const router = useRouter();

  const openCreateIssue = (stateId?: string) => {
    setDefaultStateId(stateId);
    setOpen(true);
  };

  // Listen for the global event from out-of-scope components (like CommandPalette)
  useEffect(() => {
    const handleGlobalOpen = (e: Event) => {
      // If event passes a custom detail for stateId, we can cast and extract it
      const customEvent = e as CustomEvent<{ defaultStateId?: string }>;
      openCreateIssue(customEvent.detail?.defaultStateId);
    };

    window.addEventListener("open-create-issue", handleGlobalOpen);
    return () => window.removeEventListener("open-create-issue", handleGlobalOpen);
  }, []);

  return (
    <CreateIssueContext.Provider value={{ openCreateIssue }}>
      {children}
      <CreateIssueDialog
        open={open}
        onOpenChange={setOpen}
        projectId={projectId}
        workspaceId={workspaceId}
        states={states}
        sprints={sprints}
        epics={epics}
        releases={releases}
        defaultStateId={defaultStateId}
        onSuccess={(issue) => {
          router.refresh();
        }}
      />
    </CreateIssueContext.Provider>
  );
}
