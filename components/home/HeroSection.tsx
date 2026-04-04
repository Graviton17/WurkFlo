'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { KanbanPreview } from './KanbanPreview';

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex flex-col items-center justify-center">
      {/* Background glowing effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff1f1f]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3c00ff]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10 w-full mt-[-20px] flex flex-col items-center text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 text-sm text-white/80"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>WurkFlo 2.0 is now live</span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.1] max-w-[800px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The project management platform for high-velocity software teams.
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-white/60 max-w-[600px] tracking-tight leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Streamline your workflow, track progress in real-time, and ship faster with our intuitive Kanban boards and powerful collaboration tools.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-[#ff1f1f] hover:bg-[#ff1f1f]/90 text-white rounded-full px-8 py-6 text-lg font-medium shadow-[0_0_40px_-10px_#ff1f1f]">
              Start Building for Free
            </Button>
          </Link>
          <Link href="/demo" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white/20 hover:bg-white/5 text-white shadow-sm rounded-full px-8 py-6 text-lg font-medium">
              View Interactive Demo
            </Button>
          </Link>
        </motion.div>

        {/* Bottom Kanban Preview */}
        <motion.div
          className="w-full max-w-[1000px] mt-20 transform perspective-1000"
          initial={{ opacity: 0, y: 40, rotateX: 5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 100 }}
        >
          <div className="relative group perspective">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ff1f1f] to-[#3c00ff] rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <KanbanPreview />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
