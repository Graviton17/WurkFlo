'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export const DeveloperUxBlock = () => {
  return (
    <div className="w-full h-full bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative group overflow-hidden hover:border-[#ff1f1f]/30 transition-colors duration-500">
       <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm bg-[#0c0c0d] border border-white/20 rounded-xl shadow-2xl overflow-hidden relative z-10"
       >
         <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 text-white/50">
           <Terminal className="w-4 h-4" />
           <span className="text-sm">Search or type a command...</span>
           <div className="ml-auto flex gap-1">
             <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono border border-white/10">⌘</span>
             <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono border border-white/10">K</span>
           </div>
         </div>
         <div className="p-2">
           <div className="px-2 py-1.5 text-xs text-white/30 font-semibold mt-1">Actions</div>
           <motion.div 
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              className="px-3 py-2 rounded-lg bg-white/5 text-white/90 text-sm flex items-center justify-between cursor-pointer border border-white/5 transition-colors"
           >
             <span>Create new Issue</span>
             <span className="text-xs text-white/40 font-mono">↵</span>
           </motion.div>
         </div>
       </motion.div>
       <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all duration-500 z-0" />
    </div>
  );
};
