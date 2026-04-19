"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban, List, Milestone, Tag, Hash, Timer } from "lucide-react";

interface ProjectTabsHeaderProps {
  projectId: string;
  projectName?: string;
  projectIdentifier?: string;
}

const TABS = [
  {
    id: "board",
    label: "Active Sprint",
    icon: Kanban,
    path: (id: string) => `/dashboard/project/${id}/board`,
  },
  {
    id: "sprints",
    label: "Sprints",
    icon: Timer,
    path: (id: string) => `/dashboard/project/${id}/sprints`,
  },
  {
    id: "backlog",
    label: "Backlog",
    icon: List,
    path: (id: string) => `/dashboard/project/${id}/backlog`,
  },
  {
    id: "epics",
    label: "Epics",
    icon: Milestone,
    path: (id: string) => `/dashboard/project/${id}/epics`,
  },
  {
    id: "releases",
    label: "Releases",
    icon: Tag,
    path: (id: string) => `/dashboard/project/${id}/releases`,
  },
];

export function ProjectTabsHeader({
  projectId,
  projectName,
  projectIdentifier,
}: ProjectTabsHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-30 bg-[#0c0c0d]/95 backdrop-blur-md border-b border-white/[0.06]">
      {/* Project Name Row */}
      <div className="flex items-center gap-2.5 px-6 pt-3.5 pb-1.5">
        <div className="w-5 h-5 rounded flex items-center justify-center bg-[#111] border border-white/20 ring-1 ring-white/10 shrink-0">
          <Hash size={11} className="text-white/70" strokeWidth={2.5} />
        </div>
        {projectIdentifier && (
          <span className="text-[11px] font-mono text-white/30 uppercase tracking-wide">
            {projectIdentifier}
          </span>
        )}
        {projectIdentifier && <span className="text-white/[0.12] font-light text-xs">/</span>}
        <h1 className="text-[14px] font-semibold text-white/80 tracking-tight">
          {projectName || "Project"}
        </h1>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-0.5 px-4">
        {TABS.map((tab) => {
          const isActive = pathname?.includes(`/${tab.id}`);
          return (
            <Link
              key={tab.id}
              href={tab.path(projectId)}
              className={`relative flex items-center gap-2 px-3.5 py-3 text-[13px] font-medium transition-all ${
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <tab.icon size={15} className="shrink-0" strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
