'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Layout, MonitorSmartphone, PenTool } from 'lucide-react';

const logos = [
  { name: 'Logoipsum', icon: Layers },
  { name: 'Logoipsum', icon: Layout },
  { name: 'Logoipsum', icon: MonitorSmartphone },
  { name: 'LOGO', icon: PenTool },
  { name: 'Logoipsum', icon: Layers },
  { name: 'Logoipsum', icon: Layout },
];

export const LogoTicker = () => {
  return (
    <section className="py-12 border-y border-white/5 bg-white/[0.02] overflow-hidden whitespace-nowrap mt-10">
      <div 
        className="max-w-[1280px] mx-auto px-6 relative"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 100px, black calc(100% - 100px), transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 100px, black calc(100% - 100px), transparent)'
        }}
      >
        <div className="flex w-fit">
          <motion.div
            animate={{ x: '-50%' }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
              repeatType: 'loop',
            }}
            className="flex gap-24 pr-24"
          >
            {/* Double the logos to make continuous scroll seamless */}
            {[...logos, ...logos].map((logo, index) => {
              const Icon = logo.icon;
              return (
                <div key={index} className="flex items-center gap-3 text-white/40 hover:text-white/80 transition-colors">
                  <Icon className="w-8 h-8" />
                  <span className="text-xl font-bold tracking-tight">{logo.name}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
