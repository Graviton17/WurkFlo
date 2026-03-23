'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, ListTodo, Star } from 'lucide-react';

const tasks = [
  { id: 'PER-06', title: 'Personal website project', badge: 'Mobile app project', date: 'May 20', color: 'bg-green-500/20 text-green-400' },
  { id: 'PER-07', title: 'New Design Guidelines', badge: 'Framer website', date: 'May 20', color: 'bg-indigo-500/20 text-indigo-400' },
];

const backlog = [
  { id: 'PER-06', title: 'Trav tour v1', badge: 'Mobile app project', date: 'May 20', color: 'bg-white/10 text-white/60' },
  { id: 'PER-07', title: 'Vim Drive OS update', badge: 'Design System Update', date: 'May 20', color: 'bg-white/10 text-white/60' },
  { id: 'PER-07', title: 'Skate Drag Landing Page', badge: 'Framer website', date: 'May 20', color: 'bg-white/10 text-white/60' },
];

export const FeaturesDashboard = () => {
  return (
    <section className="py-32 relative max-w-[1280px] mx-auto px-6">
      
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Mock UI Dashboard */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-black/40 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col h-[600px] relative"
        >
          {/* Dashboard Header mock */}
          <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between">
            <div className="flex gap-4">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex gap-4 text-white/40 text-sm">
              <span className="text-white">Features</span>
              <span>Achievements</span>
              <span>Benefits</span>
            </div>
          </div>
          
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar mock */}
            <div className="w-64 border-r border-white/5 p-6 space-y-8">
              <div>
                <div className="flex items-center gap-3 text-white/90 font-medium mb-4">
                  <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">C</div>
                  Cube Ai
                </div>
                <div className="space-y-3 mt-8">
                  <div className="text-sm text-white/40 flex items-center justify-between">
                    <span className="flex items-center gap-2"><Star className="w-4 h-4"/> Favorite</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="text-sm text-white/80 pl-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" /> Break it On Purpose
                  </div>
                  <div className="text-sm text-white/50 pl-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500/50" /> Big Brain Zone
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content mock */}
            <div className="flex-1 p-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <ListTodo className="w-4 h-4" /> Todo <span className="text-white/30 ml-2">2</span>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                {tasks.map(task => (
                  <div key={task.title} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white/30">{task.id}</span>
                      <CheckCircle2 className="w-4 h-4 text-white/20" />
                      <span className="text-sm text-white/90">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${task.color}`}>{task.badge}</span>
                      <span className="text-xs text-white/30">{task.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
                Backlog <span className="text-white/30 ml-2">{backlog.length}</span>
              </div>
              
              <div className="space-y-2">
                 {backlog.map(task => (
                  <div key={task.title} className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white/30">{task.id}</span>
                      <CheckCircle2 className="w-4 h-4 text-white/20" />
                      <span className="text-sm text-white/50">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${task.color}`}>{task.badge}</span>
                      <span className="text-xs text-white/30">{task.date}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
          {/* Subtle gradient overlay at bottom of mock */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </motion.div>

        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Streamline your workflow with powerful tools
          </h2>
          <p className="text-lg text-white/50 leading-relaxed max-w-lg">
            Organize tasks, manage your backlog, and keep your entire team aligned. 
            WurkFlo brings all your project tracking into one beautiful, lightning-fast interface.
          </p>
          
          <ul className="space-y-4 pt-4">
            {['Intuitive project structure', 'Custom labels and tags', 'Real-time collaboration'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <CheckCircle2 className="w-5 h-5 text-[#ff1f1f]" />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
