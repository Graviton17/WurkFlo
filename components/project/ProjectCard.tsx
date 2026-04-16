"use client";

import { motion } from "framer-motion";
import { FolderKanban } from "lucide-react";
import { Project } from "@/types/index";
import { staggerItem } from "@/lib/motion";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div variants={staggerItem}>
      <Link
        href={`/dashboard/project/${project.id}`}
        className="group flex items-center gap-3.5 rounded-xl border border-white/[0.08] bg-[#0a0a0a]/60 backdrop-blur-md px-4 py-3.5 transition-all duration-200 hover:border-white/[0.15] hover:bg-[#0a0a0a]/80 hover:shadow-lg hover:shadow-black/20 cursor-pointer"
      >
        {/* Icon Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/10 text-amber-400/70 group-hover:text-amber-400 transition-colors">
          <FolderKanban size={14} />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white/90 group-hover:text-white transition-colors">
            {project.name}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {project.identifier}
            {project.description && (
              <span className="ml-1.5 text-white/30">· {project.description}</span>
            )}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
