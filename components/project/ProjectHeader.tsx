import { Project } from "@/types/index";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-[12px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-500 uppercase tracking-wider text-sm shadow-inner shadow-emerald-500/10">
          {project.identifier}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">{project.name}</h1>
      </div>
      
      {project.description ? (
        <p className="text-white/50 text-sm max-w-2xl leading-relaxed mt-1">{project.description}</p>
      ) : (
        <p className="text-white/30 text-sm max-w-2xl italic mt-1">No description provided for this project.</p>
      )}
    </div>
  );
}
