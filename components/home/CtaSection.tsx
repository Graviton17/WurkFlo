'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const CtaSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#0c0c0d] border-t border-white/5">
      {/* Background glowing effects to match hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#ff1f1f]/5 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tighter text-white leading-tight">
            Ready to ship software faster?
          </h2>
          
          <div className="mt-4">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-white hover:bg-neutral-200 text-black rounded-full px-10 py-7 text-xl font-medium shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] transition-all hover:scale-105"
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
