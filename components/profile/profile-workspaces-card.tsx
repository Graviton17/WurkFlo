"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { Building2, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { WorkspaceWithRole } from "@/types/index";

interface ProfileWorkspacesCardProps {
  workspaces: WorkspaceWithRole[];
}

const roleBadgeStyles: Record<string, string> = {
  owner: "bg-[#ff1f1f]/15 text-[#ff6b6b] border-[#ff1f1f]/20",
  admin: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  member: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  guest: "bg-white/10 text-white/50 border-white/10",
};

export function ProfileWorkspacesCard({ workspaces }: ProfileWorkspacesCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative overflow-hidden border border-white/10 rounded-2xl bg-[#0a0a0a]/70 backdrop-blur-xl p-8 shadow-2xl"
    >
      {/* Decorative gradient line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

      <div className="flex items-center gap-2 mb-6">
        <Building2 size={16} className="text-[#ff1f1f]" />
        <h2 className="text-sm font-bold tracking-wider uppercase text-white/70">Your Workspaces</h2>
        <span className="ml-auto text-xs text-white/30">{workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}</span>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-8">
          <Building2 size={32} className="mx-auto text-white/15 mb-3" />
          <p className="text-white/40 text-sm">You are not a member of any workspace yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              href={`/dashboard/workspace/${ws.id}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
            >
              {/* Workspace icon */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff1f1f]/10 to-[#3c00ff]/10 border border-white/10 flex items-center justify-center text-white/60 text-sm font-bold shrink-0">
                {ws.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{ws.name}</p>
                <p className="text-xs text-white/30 truncate">/{ws.slug}</p>
              </div>

              {/* Role badge */}
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${roleBadgeStyles[ws.role] || roleBadgeStyles.guest}`}>
                {ws.role}
              </span>

              {/* Open indicator */}
              <ExternalLink size={14} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
