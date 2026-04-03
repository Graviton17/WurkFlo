"use client";

import { useState } from "react";
import { WorkspaceWithRole } from "@/types/index";
import { WorkspaceSearchBar } from "./WorkspaceSearchBar";
import { WorkspaceGrid } from "./WorkspaceGrid";
import { NewWorkspaceDialog } from "./NewWorkspaceDialog";
import { WorkspacePageHeader } from "./WorkspacePageHeader";

interface WorkspaceManagerProps {
  workspaces: WorkspaceWithRole[];
}

export function WorkspaceManager({ workspaces }: WorkspaceManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16">
      <WorkspacePageHeader />

        {/* Controls row */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <WorkspaceSearchBar value={searchQuery} onChange={setSearchQuery} />
          <NewWorkspaceDialog />
        </div>

        <WorkspaceGrid workspaces={workspaces} searchQuery={searchQuery} />
    </div>
  );
}
