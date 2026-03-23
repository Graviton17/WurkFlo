'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex flex-col items-center justify-center">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff1f1f]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#3c00ff]/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-[-100px]">


        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white max-w-[900px] leading-[1.1]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A singular place for all project documentation
        </motion.h1>
        
        <motion.p 
          className="mt-6 text-lg md:text-xl text-white/50 max-w-[600px] tracking-tight leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Shape your product ideas. Ideate and specify what to build next. Work on proposals and discuss specs in collaborative project documents.
        </motion.p>
        
        <motion.div 
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button size="lg" className="bg-[#ff1f1f] hover:bg-[#ff1f1f]/90 text-white rounded-full px-8 py-6 text-lg font-medium">
            Join Waitlist
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
