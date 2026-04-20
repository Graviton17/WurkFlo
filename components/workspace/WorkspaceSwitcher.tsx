"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronsUpDown, Check, Search, Plus } from "lucide-react";
import { WorkspaceWithRole } from "@/types/index";

export function WorkspaceSwitcher({ workspaces, activeWorkspaceId }: { workspaces: WorkspaceWithRole[], activeWorkspaceId?: string | null }) {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentWorkspaceId = activeWorkspaceId || (params?.id as string | undefined) || (workspaces.length > 0 ? workspaces[0].id : undefined);

  const currentWorkspace = currentWorkspaceId 
    ? workspaces.find((w) => w.id === currentWorkspaceId) ?? (workspaces.length > 0 ? workspaces[0] : null)
    : (workspaces.length > 0 ? workspaces[0] : null);

  const filteredWorkspaces = useMemo(() => {
    if (!search.trim()) return workspaces;
    const lowerSearch = search.toLowerCase();
    return workspaces.filter((w) => w.name.toLowerCase().includes(lowerSearch));
  }, [search, workspaces]);

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
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1c1c1e] border border-border/60 text-muted-foreground group-hover:text-foreground transition-colors">
          <span className="text-[10px] font-semibold">
            {currentWorkspace?.name?.[0]?.toUpperCase() || "W"}
          </span>
        </div>
        <span className="text-sm font-medium text-foreground tracking-tight truncate max-w-[150px]">
          {currentWorkspace?.name || "Workspaces"}
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
                placeholder="Find workspace..."
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
            {filteredWorkspaces.length > 0 ? (
              filteredWorkspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setOpen(false);
                    document.cookie = `wurkflo_active_workspace_id=${ws.id}; path=/; max-age=31536000`;
                    localStorage.setItem("wurkflo_active_workspace_id", ws.id);
                    router.push(`/dashboard/workspace/${ws.id}`);
                    router.refresh();
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
                    currentWorkspaceId === ws.id 
                      ? "bg-secondary text-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span className="truncate pr-4">{ws.name}</span>
                  {currentWorkspaceId === ws.id && <Check size={14} className="text-foreground shrink-0" />}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                No workspaces found
              </div>
            )}
          </div>

          <div className="h-[1px] bg-border/50 my-1" />

          {/* Footer actions */}
          <div className="py-1 px-1 flex flex-col gap-0.5">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard/workspace");
                router.refresh();
              }}
              className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors"
            >
              All Workspaces
            </button>
            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard/new");
              }}
              className="w-full px-3 py-2 text-sm text-[#888] hover:text-white hover:bg-secondary/50 rounded-md transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              New workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
