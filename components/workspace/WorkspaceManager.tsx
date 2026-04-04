"use client";

import { useState } from "react";
import { WorkspaceWithRole } from "@/types/index";
import { WorkspaceSearchBar } from "./WorkspaceSearchBar";
import { WorkspaceGrid } from "./WorkspaceGrid";
import { WorkspacePageHeader } from "./WorkspacePageHeader";
import Link from "next/link";
import { Plus } from "lucide-react";

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
          <Link
            href="/dashboard/new"
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 bg-[#016238] hover:bg-[#016238]/90 text-white border-0 font-medium"
          >
            <Plus size={14} />
            New workspace
          </Link>
        </div>

        <WorkspaceGrid workspaces={workspaces} searchQuery={searchQuery} />
    </div>
  );
}
