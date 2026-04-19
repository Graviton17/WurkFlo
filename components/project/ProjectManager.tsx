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
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[120px] pointer-events-none" />

      <motion.div variants={fadeInUp} className="mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-5 text-sm text-white/60">
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Projects</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          Your Projects
        </h1>
        <p className="text-white/50 mt-2 text-[15px]">Manage and organize your team projects.</p>
      </motion.div>

      {/* Controls row */}
      <motion.div variants={fadeInUp} className="mb-8 flex items-center justify-between gap-4">
        <ProjectSearchBar value={searchQuery} onChange={setSearchQuery} />
        <Link
          href={`/dashboard/new/${workspaceId}`}
          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-sm transition-all h-9 px-4 bg-white/[0.06] hover:bg-white/[0.10] text-white border border-white/10 hover:border-white/20 font-medium shrink-0"
        >
          <Plus size={14} />
          New project
        </Link>
      </motion.div>

      <ProjectGrid projects={projects} searchQuery={searchQuery} />
    </motion.div>
  );
}
