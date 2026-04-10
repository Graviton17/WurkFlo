"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Search,
  LayoutGrid,
  Book,
  Edit3,
  User,
  StickyNote,
  Settings,
  MoreHorizontal,
  FolderOpen,
  Sparkles,
  PanelLeftClose,
  ListFilter,
  KanbanSquare,
  Layers
} from "lucide-react";

interface SidebarProps {
  workspaceSlug: string;
  projectId?: string;
  workspaceId?: string;
}

export function Sidebar({ workspaceSlug, projectId, workspaceId }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex fixed left-0 top-[52px] h-[calc(100vh-52px)] w-[300px] border-r border-white/13 bg-[#0d0d0f] flex-shrink-0 z-40">

      {/* 1. Thin App Sidebar */}
      <aside className="w-[60px] h-full flex flex-col items-center py-4 border-r border-white/10 bg-[#101012]">
        <div className="flex flex-col gap-4 w-full px-2">
          <Link href={workspaceId ? `/dashboard/workspace/${workspaceId}` : `/dashboard/workspace`} className="flex flex-col items-center justify-center gap-1 w-full p-2 text-white bg-white/10 rounded-lg group">
            <LayoutGrid size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[0.6rem] font-medium">Projects</span>
          </Link>

          <Link href={projectId ? `/dashboard/project/${projectId}/wiki` : `/${workspaceSlug}/wiki`} className="flex flex-col items-center justify-center gap-1 w-full p-2 text-[#888] hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
            <Book size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[0.6rem] font-medium">Wiki</span>
          </Link>

          <Link href={projectId ? `/dashboard/project/${projectId}/ai` : `/${workspaceSlug}/ai`} className="flex flex-col items-center justify-center gap-1 w-full p-2 text-[#888] hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
            <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[0.6rem] font-medium">AI</span>
          </Link>
        </div>

        <div className="mt-auto w-full px-2">
          <Link href={projectId ? `/dashboard/project/${projectId}/settings` : `/${workspaceSlug}/settings`} className="flex flex-col items-center justify-center gap-1 w-full p-2 text-[#888] hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
            <Settings size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[0.6rem] font-medium">Settings</span>
          </Link>
        </div>
      </aside>

      {/* 2. Inner Module Sidebar */}
      <aside className="w-[240px] h-full flex flex-col bg-[#1a1a1a] relative">
        <div className="p-3">
          {/* Header */}
          <div className="flex items-center justify-between px-2 mb-4">
            <h2 className="text-[0.95rem] font-semibold text-[#f0f0f0]">Projects</h2>
            <div className="flex items-center gap-1">
              <button className="p-1 text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 rounded transition-colors"><ListFilter size={14} /></button>
              <button className="p-1 text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 rounded transition-colors"><PanelLeftClose size={14} /></button>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 mb-4 bg-white/5 hover:bg-white/10 text-[#f0f0f0] px-3 py-1.5 rounded-md text-[0.85rem] transition-colors border border-white/5">
            <span className="text-lg leading-none mb-0.5">+</span>
            <span>New work item</span>
          </button>

          <div className="space-y-0.5">
            <Link href={projectId ? `/dashboard/project/${projectId}/home` : `/${workspaceSlug}/home`} className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-[0.85rem] ${pathname?.includes('/home') && !pathname?.includes('/get-started') ? 'bg-white/10 text-white' : 'text-[#888] hover:bg-white/5 hover:text-[#f0f0f0]'}`}>
              <LayoutGrid size={15} />
              <span>Home</span>
            </Link>
            <Link href={projectId ? `/dashboard/project/${projectId}/issues` : `/${workspaceSlug}/issues`} className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-[0.85rem] ${pathname?.includes('/issues') ? 'bg-white/10 text-white' : 'text-[#888] hover:bg-white/5 hover:text-[#f0f0f0]'}`}>
              <KanbanSquare size={15} />
              <span>Issues</span>
            </Link>
            <Link href={projectId ? `/dashboard/project/${projectId}/workflow-states` : `/${workspaceSlug}/workflow-states`} className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-[0.85rem] ${pathname?.includes('/workflow-states') ? 'bg-white/10 text-white' : 'text-[#888] hover:bg-white/5 hover:text-[#f0f0f0]'}`}>
              <Layers size={15} />
              <span>Workflow States</span>
            </Link>
            <Link href={projectId ? `/dashboard/project/${projectId}/your-work` : `/${workspaceSlug}/your-work`} className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-[0.85rem] ${pathname?.includes('/your-work') ? 'bg-white/10 text-white' : 'text-[#888] hover:bg-white/5 hover:text-[#f0f0f0]'}`}>
              <User size={15} />
              <span>Your work</span>
            </Link>
            <Link href={projectId ? `/dashboard/project/${projectId}/stickies` : `/${workspaceSlug}/stickies`} className="flex items-center gap-2 px-2 py-1.5 text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 rounded-md transition-colors text-[0.85rem]">
              <StickyNote size={15} />
              <span>Stickies</span>
            </Link>
          </div>

          {/* Workspace Sections */}
          <div className="mt-6">
            <div className="px-2 text-[0.7rem] font-medium text-[#888] uppercase tracking-wider mb-2">Workspace</div>
            <Link href={workspaceId ? `/dashboard/workspace/${workspaceId}` : `/dashboard/workspace`} className="flex items-center gap-2 px-2 py-1.5 text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 rounded-md transition-colors text-[0.85rem]">
              <FolderOpen size={15} />
              <span>Projects</span>
            </Link>
            <button className="flex items-center gap-2 px-2 py-1.5 text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 rounded-md transition-colors text-[0.85rem] w-full text-left">
              <MoreHorizontal size={15} />
              <span>More</span>
            </button>
          </div>

          {/* Projects list placeholder */}
          <div className="mt-6 flex flex-col">
            <div className="flex items-center justify-between px-2 text-[0.7rem] font-medium text-[#888] uppercase tracking-wider mb-2">
              <span>Projects</span>
              <ChevronDown size={12} />
            </div>
            <Link href={projectId ? `/dashboard/project/${projectId}` : `/${workspaceSlug}/projects/harshi`} className="flex items-center gap-2 px-2 py-1.5 text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 rounded-md transition-colors text-[0.85rem]">
              <span className="text-amber-500">✨</span>
              <span>Harshi</span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
