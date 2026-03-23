'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AgileManagementBlock = () => {
  return (
    <div className="w-full h-full bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ff1f1f]/30 transition-colors duration-500">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-white/80">Sprint 42</div>
        <div className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/20">Active</div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
             className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer transition-colors"
           >
             <div className="flex items-center gap-3">
               <div className="w-4 h-4 rounded-full border border-white/20" />
               <div className="h-2 w-24 bg-white/20 rounded-full" />
             </div>
             <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">
               {i * 2 + 1}
             </div>
           </motion.div>
        ))}
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />
    </div>
  );
};
