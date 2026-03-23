'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bug, LayoutDashboard } from 'lucide-react';

export const IssueTrackingBlock = () => {
  return (
    <div className="w-full h-full bg-black/40 border border-white/10 rounded-2xl p-6 overflow-hidden relative flex flex-col group hover:border-[#ff1f1f]/30 transition-colors duration-500">
      <div className="flex gap-4 h-full relative z-10">
         {/* Custom Kanban Board */}
         <div className="flex-1 space-y-3">
           <div className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">To Do</div>
           <motion.div 
             whileHover={{ y: -2, scale: 1.02 }}
             className="p-3 rounded-xl bg-white/5 border border-white/10 shadow-sm cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
           >
             <div className="flex items-center gap-2 mb-2">
               <Bug className="w-3 h-3 text-red-500" />
               <span className="text-xs text-white/80 font-medium">Memory leak</span>
             </div>
             <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
               <div className="h-full bg-red-500/60 w-1/3" />
             </div>
           </motion.div>
         </div>
         <div className="flex-1 space-y-3">
           <div className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">In Progress</div>
           <motion.div 
             initial={{ y: 20, opacity: 0.5 }}
             animate={{ y: 0, opacity: 1 }}
             whileHover={{ y: -2, scale: 1.02 }}
             className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-sm cursor-grab active:cursor-grabbing hover:bg-indigo-500/20 transition-colors"
           >
             <div className="flex items-center gap-2 mb-2">
               <LayoutDashboard className="w-3 h-3 text-indigo-400" />
               <span className="text-xs text-indigo-100 font-medium">Update UI</span>
             </div>
           </motion.div>
         </div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-red-500/20 transition-all duration-500 z-0" />
    </div>
  );
};
