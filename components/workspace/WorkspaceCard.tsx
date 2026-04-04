import Link from "next/link";
import { Component } from "lucide-react";
import { WorkspaceWithRole } from "@/types/index";

interface WorkspaceCardProps {
  workspace: WorkspaceWithRole;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const projectCount = workspace.member_count ?? 1;
  const projectLabel = projectCount === 1 ? "1 project" : `${projectCount} projects`;

  return (
    <Link
      href={`/dashboard/workspace/${workspace.id}`}
      className="group flex items-center gap-3.5 rounded-lg border border-border/50 bg-[#1f1e1e]/60 px-4 py-3.5 transition-all duration-150 hover:border-border hover:bg-[#1f1e1e] cursor-pointer"
    >
      {/* Icon Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1c1c1e] border border-border/60 text-muted-foreground group-hover:text-foreground transition-colors">
        <Component size={14} />
      </div>

      {/* Info */}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground group-hover:text-white transition-colors">
          {workspace.name}
        </p>
        <p className="text-xs text-muted-foreground/80 mt-0.5">
          {projectLabel}
        </p>
      </div>
    </Link>
  );
}
