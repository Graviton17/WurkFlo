"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Inbox,
  ListChecks,
  ChevronDown,
  ChevronRight,
  Plus,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Hash,
} from "lucide-react";
import { WorkspaceWithRole, Project } from "@/types/index";

interface AppSidebarProps {
  workspaces: WorkspaceWithRole[];
  activeWorkspaceId?: string | null;
  projects?: Project[];
}

export function AppSidebar({
  workspaces,
  activeWorkspaceId,
  projects = [],
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [workspaceSwitcherOpen, setWorkspaceSwitcherOpen] = useState(false);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const displayName = activeWorkspace?.name || "Workspace";

  // Keyboard shortcut to toggle sidebar
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const isActive = (path: string) => pathname === path;
  const isActivePrefix = (path: string) => pathname?.startsWith(path);

  if (collapsed) {
    return (
      <aside className="w-[52px] h-full flex flex-col items-center py-3 bg-[#0c0c0e] border-r border-white/[0.06] shrink-0 transition-all duration-200">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 text-[#666] hover:text-[#aaa] hover:bg-white/5 rounded-lg transition-colors mb-4"
          title="Expand sidebar (⌘B)"
        >
          <PanelLeftOpen size={18} />
        </button>

        <div className="flex flex-col items-center gap-1 mt-2 w-full px-1.5">
          <Link
            href="/dashboard/inbox"
            className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
              isActive("/dashboard/inbox")
                ? "bg-white/10 text-white"
                : "text-[#666] hover:text-[#aaa] hover:bg-white/5"
            }`}
            title="Inbox"
          >
            <Inbox size={18} />
          </Link>
          <Link
            href="/dashboard/my-issues"
            className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
              isActive("/dashboard/my-issues")
                ? "bg-white/10 text-white"
                : "text-[#666] hover:text-[#aaa] hover:bg-white/5"
            }`}
            title="My Issues"
          >
            <ListChecks size={18} />
          </Link>
        </div>

        <div className="mt-auto w-full px-1.5 flex flex-col items-center gap-1">
          <Link
            href="/profile"
            className="w-full flex items-center justify-center p-2 text-[#666] hover:text-[#aaa] hover:bg-white/5 rounded-lg transition-colors"
            title="Profile"
          >
            <User size={18} />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[260px] h-full flex flex-col bg-[#0c0c0e] border-r border-white/[0.06] shrink-0 transition-all duration-200 overflow-hidden">
      {/* Workspace Switcher */}
      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <button
            onClick={() => setWorkspaceSwitcherOpen(!workspaceSwitcherOpen)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-white/[0.04] rounded-lg transition-colors text-left group"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[11px] font-bold leading-none shrink-0 shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[13.5px] font-semibold text-[#e0e0e0] truncate flex-1">
              {displayName}
            </span>
            <ChevronDown
              size={14}
              className="text-[#555] group-hover:text-[#888] shrink-0 transition-colors"
            />
          </button>

          {/* Workspace Dropdown */}
          {workspaceSwitcherOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#18181b] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/60 z-50 py-1.5 max-h-[300px] overflow-y-auto">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    router.push(`/dashboard/workspace/${ws.id}`);
                    setWorkspaceSwitcherOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-white/[0.05] transition-colors ${
                    ws.id === activeWorkspaceId
                      ? "text-white bg-white/[0.04]"
                      : "text-[#999]"
                  }`}
                >
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-medium truncate">
                    {ws.name}
                  </span>
                </button>
              ))}
              <div className="border-t border-white/[0.06] mt-1.5 pt-1.5">
                <Link
                  href="/dashboard/new"
                  onClick={() => setWorkspaceSwitcherOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[#777] hover:text-[#ccc] hover:bg-white/[0.04] transition-colors text-[13px]"
                >
                  <Plus size={14} />
                  <span>Create workspace</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search trigger */}
      <div className="px-3 mt-1">
        <button
          onClick={() => {
            // Dispatch Cmd+K event to open command palette
            window.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
              })
            );
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-[7px] bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.08] rounded-lg transition-all text-left group"
        >
          <Search
            size={14}
            className="text-[#555] group-hover:text-[#888] transition-colors"
          />
          <span className="text-[12.5px] text-[#555] group-hover:text-[#777] flex-1 transition-colors">
            Search...
          </span>
          <kbd className="text-[10px] text-[#444] bg-white/[0.04] px-1.5 py-0.5 rounded font-mono border border-white/[0.04]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Main Nav */}
      <div className="px-3 mt-3 space-y-0.5">
        <Link
          href="/dashboard/inbox"
          className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-all text-[13px] font-medium ${
            isActive("/dashboard/inbox")
              ? "bg-white/[0.08] text-white"
              : "text-[#777] hover:bg-white/[0.04] hover:text-[#ccc]"
          }`}
        >
          <Inbox size={16} className="shrink-0" />
          <span>Inbox</span>
        </Link>

        <Link
          href="/dashboard/my-issues"
          className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-all text-[13px] font-medium ${
            isActive("/dashboard/my-issues")
              ? "bg-white/[0.08] text-white"
              : "text-[#777] hover:bg-white/[0.04] hover:text-[#ccc]"
          }`}
        >
          <ListChecks size={16} className="shrink-0" />
          <span>My Issues</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-3 my-3 border-t border-white/[0.05]" />

      {/* Projects Section */}
      <div className="px-3 flex-1 overflow-y-auto min-h-0">
        <div className="flex items-center justify-between mb-1.5">
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#555] uppercase tracking-wider hover:text-[#888] transition-colors"
          >
            {projectsExpanded ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
            Projects
          </button>
          <Link
            href={
              activeWorkspaceId
                ? `/dashboard/workspace/${activeWorkspaceId}`
                : "/dashboard/workspace"
            }
            className="p-1 text-[#444] hover:text-[#aaa] hover:bg-white/5 rounded transition-colors"
            title="Manage projects"
          >
            <Plus size={14} />
          </Link>
        </div>

        {projectsExpanded && (
          <div className="space-y-0.5">
            {projects.length === 0 ? (
              <div className="px-2.5 py-4 text-[12px] text-[#444] text-center">
                No projects yet
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/project/${project.id}/board`}
                  className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg transition-all text-[13px] group ${
                    isActivePrefix(`/dashboard/project/${project.id}`)
                      ? "bg-white/[0.08] text-white font-medium"
                      : "text-[#777] hover:bg-white/[0.04] hover:text-[#ccc]"
                  }`}
                >
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/10 shrink-0">
                    <Hash
                      size={11}
                      className="text-amber-400/80"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="truncate">{project.name}</span>
                  <span className="ml-auto text-[10px] text-[#444] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.identifier}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="px-3 pb-3 pt-2 border-t border-white/[0.05] space-y-0.5 mt-auto">
        <Link
          href="/profile"
          className="flex items-center gap-2.5 px-2.5 py-[7px] text-[#666] hover:text-[#ccc] hover:bg-white/[0.04] rounded-lg transition-colors text-[13px] font-medium"
        >
          <User size={16} className="shrink-0" />
          <span>Profile</span>
        </Link>
        <button
          onClick={() => setCollapsed(true)}
          className="w-full flex items-center gap-2.5 px-2.5 py-[7px] text-[#555] hover:text-[#aaa] hover:bg-white/[0.04] rounded-lg transition-colors text-[13px] text-left"
          title="Collapse sidebar (⌘B)"
        >
          <PanelLeftClose size={16} className="shrink-0" />
          <span>Collapse</span>
        </button>
      </div>
    </aside>
  );
}
