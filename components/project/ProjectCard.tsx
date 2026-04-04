import { FolderKanban } from "lucide-react";
import { Project } from "@/types/index";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/dashboard/project/${project.id}`}
      className="group flex items-center gap-3.5 rounded-lg border border-border/50 bg-[#1f1e1e]/60 px-4 py-3.5 transition-all duration-150 hover:border-border hover:bg-[#1f1e1e] cursor-pointer"
    >
      {/* Icon Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1c1c1e] border border-border/60 text-muted-foreground group-hover:text-foreground transition-colors">
        <FolderKanban size={14} />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground group-hover:text-white transition-colors">
          {project.name}
        </p>
        <p className="text-xs text-muted-foreground/80 mt-0.5">
          {project.identifier}
          {project.description && (
            <span className="ml-1.5 text-muted-foreground/60">· {project.description}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
