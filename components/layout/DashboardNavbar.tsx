"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, HelpCircle, Lightbulb, User, LogOut, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { WorkspaceSwitcher } from "@/components/workspace/WorkspaceSwitcher";
import { ProjectSwitcher } from "@/components/project/ProjectSwitcher";
import { WorkspaceWithRole, Project } from "@/types/index";
import { useSelectedLayoutSegments } from "next/navigation";

export function DashboardNavbar({ initialUser, workspaces = [] }: { initialUser?: any, workspaces?: WorkspaceWithRole[] }) {
  const [user, setUser] = useState<any>(initialUser || null);
  const [profile, setProfile] = useState<{ full_name: string | null, avatar_url: string | null } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // New State for projects when navigating project paths
  const segments = useSelectedLayoutSegments();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [workspaceProjects, setWorkspaceProjects] = useState<Project[]>([]);
  
  const isProjectRoute = segments[0] === "project";
  const urlProjectId = isProjectRoute ? segments[1] : null;
  const urlWorkspaceId = (segments[0] === "workspace" || segments[0] === "new") && segments.length > 1 ? segments[1] : null;

  useEffect(() => {

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user?.id) {
      supabase.from('users')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single()
        .then(({ data }: { data: any }) => {
          if (data) setProfile(data);
        });
    } else {
      setProfile(null);
    }
  }, [user]);

  // Fetch project context dynamically if exploring a project route
  useEffect(() => {
    let active = true;

    async function loadProjectContext() {
      if (!urlProjectId) {
        if (active) setActiveProject(null);
        return;
      }

      try {
        // Fetch project metadata
        const res = await fetch(`/api/projects/${urlProjectId}`);
        const data = await res.json();
        
        if (data.success && data.data && active) {
          const project = data.data as Project;
          setActiveProject(project);

          // Once we have the project, fetch sibling projects for switcher
          const siblingRes = await fetch(`/api/projects?workspaceId=${project.workspace_id}`);
          const siblingData = await siblingRes.json();
          if (siblingData.success && active) {
            setWorkspaceProjects(siblingData.data);
          }
        }
      } catch (err) {
        console.error("Failed to load project contextual navbar data", err);
      }
    }

    loadProjectContext();

    return () => {
      active = false;
    };
  }, [urlProjectId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const displayName = profile?.full_name || user?.email || "User";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-[#161716] border-b border-border/40">
      <div className="mx-auto w-full px-4 h-14 flex items-center justify-between">
        
        {/* Left Side: Logo & Workspace Switcher & Project Switcher */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/workspace" className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors">
            <img
              src="/favicon.ico"
              alt="WurkFlo Logo"
              width={18}
              height={18}
              className="rounded-sm"
            />
          </Link>
          <span className="text-muted-foreground/40 font-light">/</span>
          <WorkspaceSwitcher 
            workspaces={workspaces} 
            activeWorkspaceId={activeProject ? activeProject.workspace_id : urlWorkspaceId} 
          />
          
          {isProjectRoute && activeProject && (
            <>
              <span className="text-muted-foreground/40 font-light">/</span>
              <ProjectSwitcher 
                projects={workspaceProjects} 
                activeProjectId={activeProject.id} 
              />
            </>
          )}
        </div>

        {/* Right Side: Tools & Avatar */}
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary hover:bg-secondary/40 overflow-hidden transition-colors focus:outline-none"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="User Avatar" className="w-full h-full object-cover" />
              ) : profile?.full_name ? (
                <span className="text-[10px] font-semibold text-foreground/70">{initials}</span>
              ) : (
                <User size={14} className="text-foreground/70" />
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl overflow-hidden py-1 z-50">
                <div className="px-4 py-3 border-b border-border/50">
                  <p className="text-sm font-medium text-foreground truncate" title={displayName}>
                    {displayName}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}
