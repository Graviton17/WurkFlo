"use client";

import { motion } from "framer-motion";
import { Project } from "@/types/index";
import { staggerItem } from "@/lib/motion";
import Link from "next/link";
import { Hash } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const initial = project.name.charAt(0).toUpperCase();

  return (
    <motion.div variants={staggerItem}>
      <Link
        href={`/dashboard/project/${project.id}/board`}
        className="group relative flex flex-col gap-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-xl hover:shadow-black/30 cursor-pointer overflow-hidden"
      >
        {/* Decorative top hairline */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Subtle corner glow on hover */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/[0.02] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Header: Avatar + Name */}
        <div className="flex items-start gap-4">
          {/* Large avatar */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#111] border border-white/20 ring-1 ring-white/10 text-white text-base font-bold select-none">
            {initial}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="truncate text-[15px] font-semibold text-white/90 group-hover:text-white transition-colors leading-tight">
              {project.name}
            </p>
            {project.description && (
              <p className="text-[12px] text-white/35 mt-1 truncate">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Footer: identifier tag */}
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-white/40 tracking-wider">
            <Hash size={10} strokeWidth={2.5} />
            {project.identifier}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
