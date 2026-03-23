'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const insights = [
  {
    category: 'Productivity',
    date: 'Oct 24, 2025',
    title: 'How to structure your workflow for maximum efficiency',
    description: 'Learn the core principles of organizing tasks and projects correctly to save hours each week.',
    color: 'from-blue-500/20 to-blue-500/0'
  },
  {
    category: 'Engineering',
    date: 'Oct 18, 2025',
    title: 'The technical architecture behind lightning-fast search',
    description: 'A deep dive into how we built a search engine that queries 1M+ documents in under 50ms.',
    color: 'from-purple-500/20 to-purple-500/0'
  },
  {
    category: 'Announcements',
    date: 'Oct 12, 2025',
    title: 'Introducing WurkFlo 2.0: A new era of project management',
    description: 'Everything you need to know about our biggest update yet, including redesigns and new features.',
    color: 'from-[#ff1f1f]/20 to-[#ff1f1f]/0'
  }
];

export const InsightsSection = () => {
  return (
    <section className="py-32 max-w-[1280px] mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Insights & Updates
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            Read the latest news, product updates, and engineering practices from the WurkFlo team.
          </p>
        </motion.div>
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <Link href="/blog" className="flex items-center gap-2 text-white hover:text-[#ff1f1f] transition-colors group">
            <span className="font-medium">View all articles</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="bg-black/40 border-white/10 overflow-hidden group hover:border-white/20 transition-colors cursor-pointer h-full backdrop-blur-md">
              <div className={`h-48 bg-gradient-to-b ${insight.color} border-b border-white/5 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-4 left-6 flex items-center justify-between w-[calc(100%-3rem)] text-sm font-medium">
                  <span className="text-white px-3 py-1 bg-white/10 rounded-full backdrop-blur-md">{insight.category}</span>
                  <span className="text-white/60">{insight.date}</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#ff1f1f] transition-colors leading-snug">
                  {insight.title}
                </h3>
                <p className="text-white/50 leading-relaxed line-clamp-3">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
