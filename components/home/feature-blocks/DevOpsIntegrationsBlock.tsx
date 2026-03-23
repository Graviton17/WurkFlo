'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, CheckCircle2 } from 'lucide-react';

export const DevOpsIntegrationsBlock = () => {
  return (
    <div className="w-full h-full bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ff1f1f]/30 transition-colors duration-500">
      <div className="space-y-4 relative z-10">
        <motion.div 
           whileHover={{ scale: 1.02 }}
           className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors"
        >
           <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
             <GitPullRequest className="w-5 h-5 text-emerald-400" />
           </div>
           <div className="flex-1">
             <div className="flex items-center gap-2">
               <span className="text-sm font-medium text-white/90">PR #1024</span>
               <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider border border-emerald-500/20">Merged</span>
             </div>
             <div className="text-xs text-white/50 mt-1">Fix authentication flow</div>
           </div>
        </motion.div>
        <div className="flex items-center gap-2 text-sm text-white/60 pl-6 border-l-2 border-emerald-500/30 ml-5 py-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
           CI/CD Build Passed
        </div>
        <motion.div 
           initial={{ opacity: 0, x: -10 }}
           whileInView={{ opacity: 1, x: 0 }}
           className="flex items-center gap-2 text-sm text-white/90 pl-6 border-l-2 border-white/10 ml-5 py-2"
        >
           <CheckCircle2 className="w-4 h-4 text-[#ff1f1f]" />
           Issue moved to <span className="text-[#ff1f1f] ml-1">Done</span>
        </motion.div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500 z-0" />
    </div>
  );
};
