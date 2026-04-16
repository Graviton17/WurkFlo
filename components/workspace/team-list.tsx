"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion";
import { Users } from "lucide-react";

export function TeamList({ members }: { members: any[] }) {
  if (!members || members.length === 0) {
    return (
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeInUp}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase mb-4">
            <Users className="w-3.5 h-3.5" />
            Team
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Team Members</h1>
          <p className="text-white/50 text-[15px] mb-8">No team members found.</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl">
      <motion.div variants={fadeInUp} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase mb-4">
          <Users className="w-3.5 h-3.5" />
          Team
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Team Members</h1>
        <p className="text-white/50 text-[15px]">Manage who has access to this workspace.</p>
      </motion.div>

      <div className="space-y-3">
        {members.map((member) => (
          <motion.div
            key={member.user_id}
            variants={staggerItem}
            className="flex items-center justify-between p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]/60 backdrop-blur-md transition-all hover:border-white/[0.12]"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="border border-white/10">
                <AvatarImage src={member.user?.avatar_url || ""} />
                <AvatarFallback className="bg-gradient-to-br from-[#ff1f1f]/20 to-[#3c00ff]/20 text-white/70">
                  {(member.user?.full_name || member.user?.email || "U").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none text-white">
                  {member.user?.full_name || member.user?.email || `User: ${member.user_id.slice(0, 8)}...`}
                </p>
                <p className="text-xs text-white/40 mt-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    {member.role}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
