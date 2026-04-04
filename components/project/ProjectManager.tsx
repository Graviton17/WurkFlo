"use client";

import { useState } from "react";
import { Project } from "@/types/index";
import { ProjectSearchBar } from "./ProjectSearchBar";
import { ProjectGrid } from "./ProjectGrid";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectPageHeader } from "./ProjectPageHeader";

interface ProjectManagerProps {
  projects: Project[];
  workspaceId: string;
}

export function ProjectManager({ projects, workspaceId }: ProjectManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16">
      <ProjectPageHeader />

        {/* Controls row */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <ProjectSearchBar value={searchQuery} onChange={setSearchQuery} />
          <Link
            href={`/dashboard/new/${workspaceId}`}
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 bg-[#016238] hover:bg-[#016238]/90 text-white border-0 font-medium shrink-0"
          >
            <Plus size={14} />
            New project
          </Link>
        </div>

        <ProjectGrid projects={projects} searchQuery={searchQuery} />
    </div>
  );
}
