"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Component } from "lucide-react";
import { WorkspaceWithRole } from "@/types/index";
import { staggerItem } from "@/lib/motion";

interface WorkspaceCardProps {
  workspace: WorkspaceWithRole;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const projectCount = workspace.member_count ?? 1;
  const projectLabel = projectCount === 1 ? "1 project" : `${projectCount} projects`;

  return (
    <motion.div variants={staggerItem}>
      <Link
        href={`/dashboard/workspace/${workspace.id}`}
        className="group flex items-center gap-3.5 rounded-xl border border-white/[0.08] bg-[#0a0a0a]/60 backdrop-blur-md px-4 py-3.5 transition-all duration-200 hover:border-white/[0.15] hover:bg-[#0a0a0a]/80 hover:shadow-lg hover:shadow-black/20 cursor-pointer"
      >
        {/* Icon Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff1f1f]/20 to-[#3c00ff]/20 border border-[#ff1f1f]/10 text-[#ff1f1f]/70 group-hover:text-[#ff1f1f] transition-colors">
          <Component size={14} />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white/90 group-hover:text-white transition-colors">
            {workspace.name}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {projectLabel}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
