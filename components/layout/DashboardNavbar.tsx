"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, HelpCircle, Lightbulb, User, LogOut, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export function DashboardNavbar({ initialUser }: { initialUser?: any }) {
  const [user, setUser] = useState<any>(initialUser || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-[#161716] border-b border-border/40">
      <div className="mx-auto w-full px-4 h-14 flex items-center justify-between">
        
        {/* Left Side: Logo & Breadcrumbs */}
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
          <span className="text-sm font-medium text-foreground tracking-tight">Workspaces</span>
        </div>

        {/* Right Side: Tools & Avatar */}
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary hover:bg-secondary/80 transition-colors focus:outline-none"
            >
              <User size={14} className="text-foreground/70" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl overflow-hidden py-1 z-50">
                <div className="px-4 py-3 border-b border-border/50">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.email || "User"}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/onboarding");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
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
