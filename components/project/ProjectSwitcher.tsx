"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Check, Search, Plus, FolderKanban } from "lucide-react";
import { Project } from "@/types/index";

export function ProjectSwitcher({ 
  projects, 
  activeProjectId 
}: { 
  projects: Project[],
  activeProjectId?: string 
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentProject = activeProjectId 
    ? projects.find((p) => p.id === activeProjectId)
    : null;

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const lowerSearch = search.toLowerCase();
    return projects.filter((p) => p.name.toLowerCase().includes(lowerSearch));
  }, [search, projects]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 group px-2 py-1 -ml-2 rounded-md hover:bg-secondary/80 transition-colors"
      >
        <FolderKanban size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="text-sm font-medium text-foreground tracking-tight truncate max-w-[150px]">
          {currentProject?.name || "Projects"}
        </span>
        <ChevronsUpDown size={14} className="text-muted-foreground ml-1" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl overflow-hidden py-1 z-50 flex flex-col">
          {/* Search */}
          <div className="px-2 py-1.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
              <input
                type="text"
                placeholder="Find project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary/50 border-none outline-none text-sm px-8 py-1.5 rounded-md placeholder:text-muted-foreground focus:bg-secondary transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div className="h-[1px] bg-border/50 my-1 font-['Inter']" />

          {/* List */}
          <div className="max-h-[200px] overflow-y-auto py-1 px-1 custom-scrollbar flex flex-col">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setOpen(false);
                    router.push(`/dashboard/project/${p.id}`);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                    activeProjectId === p.id 
                      ? "bg-secondary text-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span className="truncate pr-4">{p.name}</span>
                  {activeProjectId === p.id && <Check size={14} className="text-foreground shrink-0" />}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                No projects found
              </div>
            )}
          </div>

          <div className="h-[1px] bg-border/50 my-1" />

          {/* Footer actions */}
          <div className="py-1 px-1 flex flex-col gap-0.5">
            <button
              onClick={() => {
                setOpen(false);
                // Can route to the workspace dashboard to see all projects
                if (currentProject) {
                  router.push(`/dashboard/workspace/${currentProject.workspace_id}`);
                }
              }}
              className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors"
            >
              All Projects
            </button>
            <button
              onClick={() => {
                setOpen(false);
                if (currentProject) {
                  router.push(`/dashboard/new/${currentProject.workspace_id}`);
                }
              }}
              disabled={!currentProject}
              className="w-full px-3 py-2 text-sm text-[#009b65] hover:text-[#009b65]/80 hover:bg-secondary/50 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
              New project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
