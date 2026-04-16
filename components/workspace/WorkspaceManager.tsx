"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WorkspaceWithRole } from "@/types/index";
import { WorkspaceSearchBar } from "./WorkspaceSearchBar";
import { WorkspaceGrid } from "./WorkspaceGrid";
import Link from "next/link";
import { Plus, Layers } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/motion";

interface WorkspaceManagerProps {
  workspaces: WorkspaceWithRole[];
}

export function WorkspaceManager({ workspaces }: WorkspaceManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-7xl px-6 py-16 relative"
    >
      {/* Decorative glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#ff1f1f]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div variants={fadeInUp} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase mb-4">
          <Layers className="w-3.5 h-3.5" />
          Workspaces
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Your Workspaces</h1>
        <p className="text-white/50 mt-2 text-[15px]">Manage and organize your team workspaces.</p>
      </motion.div>

      {/* Controls row */}
      <motion.div variants={fadeInUp} className="mb-6 flex items-center justify-between gap-4">
        <WorkspaceSearchBar value={searchQuery} onChange={setSearchQuery} />
        <Link
          href="/dashboard/new"
          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-sm transition-all h-9 px-4 bg-[#009b65] hover:bg-[#009b65]/90 text-white border-0 font-medium shadow-[0_0_20px_-6px_rgba(0,155,101,0.4)] hover:shadow-[0_0_30px_-6px_rgba(0,155,101,0.5)]"
        >
          <Plus size={14} />
          New workspace
        </Link>
      </motion.div>

      <WorkspaceGrid workspaces={workspaces} searchQuery={searchQuery} />
    </motion.div>
  );
}
