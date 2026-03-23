'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export const PlanningKnowledgeBlock = () => {
  return (
    <div className="w-full h-full bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ff1f1f]/30 transition-colors duration-500">
      <div className="h-full flex flex-col gap-4 relative z-10">
         {/* Document Mock */}
         <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 shadow-inner relative overflow-hidden flex flex-col">
           <div className="h-4 w-3/4 bg-white/20 rounded mb-4" />
           <div className="space-y-2 mb-6">
              <div className="h-2 w-full bg-white/10 rounded" />
              <div className="h-2 w-5/6 bg-white/10 rounded" />
              <div className="h-2 w-4/6 bg-white/10 rounded" />
           </div>
           {/* Linked Epic */}
           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="mt-auto bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-[#ff1f1f]/20 transition-colors"
           >
             <div className="w-7 h-7 rounded-md bg-[#ff1f1f]/20 flex items-center justify-center border border-[#ff1f1f]/20">
               <Target className="w-3.5 h-3.5 text-[#ff1f1f]" />
             </div>
             <div>
               <div className="text-[10px] font-semibold text-[#ff1f1f] uppercase tracking-wider">Linked Epic</div>
               <div className="text-xs text-white/90 font-medium">Q3 Enterprise Launch</div>
             </div>
           </motion.div>
         </div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#ff1f1f]/10 blur-2xl rounded-full pointer-events-none group-hover:bg-[#ff1f1f]/20 transition-all duration-500 z-0" />
    </div>
  );
};
