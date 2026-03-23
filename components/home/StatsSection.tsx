'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '25k+', label: 'Projects' },
  { value: '10k+', label: 'Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];

export const StatsSection = () => {
  return (
    <section className="py-24 max-w-[1280px] mx-auto px-6 border-y border-white/5 bg-white/[0.01]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex flex-col items-center text-center space-y-2"
          >
            <span className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
              {stat.value}
            </span>
            <span className="text-sm md:text-base font-medium text-white/50 uppercase tracking-widest">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
