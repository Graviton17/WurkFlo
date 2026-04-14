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
    <div className="sticky top-0 z-30 bg-[#111113]/95 backdrop-blur-md border-b border-white/[0.06]">
      {/* Project Name Row */}
      <div className="flex items-center gap-2.5 px-6 pt-4 pb-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/10">
          <Hash size={13} className="text-amber-400/80" strokeWidth={2.5} />
        </div>
        {projectIdentifier && (
          <span className="text-[12px] font-mono text-[#555] uppercase tracking-wide">
            {projectIdentifier}
          </span>
        )}
        <h1 className="text-[15px] font-semibold text-[#e8e8e8] tracking-tight">
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
              className={`flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium rounded-t-lg transition-all relative ${
                isActive
                  ? "text-white"
                  : "text-[#666] hover:text-[#aaa] hover:bg-white/[0.03]"
              }`}
            >
              <tab.icon size={15} className="shrink-0" />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-indigo-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
