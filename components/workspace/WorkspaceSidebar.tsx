"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Settings, Sidebar, Component } from "lucide-react";

export function WorkspaceSidebar({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { name: "Projects", href: `/dashboard/workspace/${workspaceId}`, icon: Component, exact: true },
    { name: "Team", href: `/dashboard/workspace/${workspaceId}/team`, icon: Users },
    { name: "Workspace Settings", href: `/dashboard/workspace/${workspaceId}/settings`, icon: Settings },
  ];

  return (
    <aside 
      className={`group transition-[width] duration-200 ease-in-out border-r border-white/[0.06] bg-[#0a0a0a]/70 backdrop-blur-xl flex flex-col z-20 shrink-0 absolute bottom-0 sm:relative min-h-[calc(100vh-3.5rem)] ${isExpanded ? 'w-[260px]' : 'w-[64px] hover:w-[260px]'}`}
    >
      {/* Top Nav Items */}
      <div className="flex flex-col gap-2 p-3 mt-1 flex-1">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors whitespace-nowrap overflow-hidden
                ${isActive ? "bg-white/[0.08] text-white" : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"}
              `}
              title={!isExpanded ? item.name : undefined}
            >
              <div className="shrink-0 flex items-center justify-center w-5">
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[13px] font-medium transition-opacity duration-200 ${isExpanded ? 'opacity-100 delay-0' : 'opacity-0 group-hover:opacity-100 group-hover:delay-100'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Toggle */}
      <div className="p-3 mb-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 px-2 py-2 rounded-md transition-colors whitespace-nowrap overflow-hidden text-white/50 hover:bg-white/[0.04] hover:text-white/80 w-full"
          title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <div className="shrink-0 flex items-center justify-center w-5">
             <Sidebar size={18} />
          </div>
          <span className={`text-[13px] font-medium transition-opacity duration-200 ${isExpanded ? 'opacity-100 delay-0' : 'opacity-0 group-hover:opacity-100 group-hover:delay-100'}`}>
            Collapse Sidebar
          </span>
        </button>
      </div>
    </aside>
  );
}
