"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { KanbanBoard } from './KanbanBoard';
import { CommandPalette } from './CommandPalette';
import { MousePointer2 } from 'lucide-react';

export function InteractiveSandbox() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      // Hide hint after 8 seconds
      const timer = setTimeout(() => setShowHint(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isInView, controls]);

  return (
    <motion.div 
      ref={containerRef}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.2 }
        }
      }}
      className="w-full h-full bg-[#0a0a0a]/80 rounded-[2rem] border border-zinc-800/80 p-6 md:p-8 flex flex-col gap-10 shadow-2xl relative overflow-hidden backdrop-blur-xl ring-1 ring-white/5"
    >
      {/* Background Glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Header & Command Palette */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        className="relative z-50 w-full flex flex-col items-center mt-2"
      >
        <div className="flex items-center gap-2.5 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 px-3 py-1.5 rounded-full mb-6 relative">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-300 text-xs font-semibold uppercase tracking-wider">
            Live Interactive Demo
          </span>
          
          {showHint && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -right-4 top-10 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap hidden sm:flex items-center gap-1"
            >
              <MousePointer2 className="w-3 h-3" />
              Try clicking this
              <div className="absolute -top-1 left-4 w-2 h-2 bg-indigo-500 rotate-45" />
            </motion.div>
          )}
        </div>
        
        <CommandPalette />
      </motion.div>

      {/* Kanban Board */}
      <motion.div 
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1 }
        }}
        className="relative z-10 w-full pb-4"
      >
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-zinc-400 font-medium text-sm flex items-center gap-2">
            Sprint Board
            <span className="bg-zinc-800/80 text-zinc-500 text-[10px] px-1.5 py-0.5 rounded border border-zinc-700/50">WIP</span>
          </h3>
          <p className="text-zinc-500 text-xs hidden sm:block">Drag cards to update status</p>
        </div>
        <KanbanBoard />
      </motion.div>
      
      {/* Glass overlay fade for bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-20" />
    </motion.div>
  );
}
