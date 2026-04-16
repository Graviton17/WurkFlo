"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Project } from "@/types/index";
import { ProjectSearchBar } from "./ProjectSearchBar";
import { ProjectGrid } from "./ProjectGrid";
import Link from "next/link";
import { Plus, FolderKanban } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/motion";

interface ProjectManagerProps {
  projects: Project[];
  workspaceId: string;
}

export function ProjectManager({ projects, workspaceId }: ProjectManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-7xl px-6 py-16 relative"
    >
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#3c00ff]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div variants={fadeInUp} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase mb-4">
          <FolderKanban className="w-3.5 h-3.5" />
          Projects
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Your Projects</h1>
        <p className="text-white/50 mt-2 text-[15px]">Manage and organize your team projects.</p>
      </motion.div>

      {/* Controls row */}
      <motion.div variants={fadeInUp} className="mb-6 flex items-center justify-between gap-4">
        <ProjectSearchBar value={searchQuery} onChange={setSearchQuery} />
        <Link
          href={`/dashboard/new/${workspaceId}`}
          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-sm transition-all h-9 px-4 bg-[#009b65] hover:bg-[#009b65]/90 text-white border-0 font-medium shrink-0 shadow-[0_0_20px_-6px_rgba(0,155,101,0.4)] hover:shadow-[0_0_30px_-6px_rgba(0,155,101,0.5)]"
        >
          <Plus size={14} />
          New project
        </Link>
      </motion.div>

      <ProjectGrid projects={projects} searchQuery={searchQuery} />
    </motion.div>
  );
}
