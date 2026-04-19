import { Project } from "@/types/index";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
  searchQuery: string;
}

export function ProjectGrid({ projects, searchQuery }: ProjectGridProps) {
  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">
          {searchQuery
            ? `No projects found for "${searchQuery}"`
            : "No projects in this workspace yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
