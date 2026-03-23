'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Bug, Terminal, GitPullRequest, BookOpen } from 'lucide-react';
import { AgileManagementBlock } from './feature-blocks/AgileManagementBlock';
import { IssueTrackingBlock } from './feature-blocks/IssueTrackingBlock';
import { DeveloperUxBlock } from './feature-blocks/DeveloperUxBlock';
import { DevOpsIntegrationsBlock } from './feature-blocks/DevOpsIntegrationsBlock';
import { PlanningKnowledgeBlock } from './feature-blocks/PlanningKnowledgeBlock';

const features = [
  {
    id: "agile",
    title: "Agile Management",
    description: "Sprint management and story point estimation. Roll over unfinished tasks effortlessly.",
    icon: Target,
    content: () => <AgileManagementBlock />
  },
  {
    id: "issues",
    title: "Issue & Bug Tracking",
    description: "Advanced Kanban boards and dedicated bug reports with custom workflows.",
    icon: Bug,
    content: () => <IssueTrackingBlock />
  },
  {
    id: "developer",
    title: "Developer-Centric UX",
    description: "Navigate instantly using the Command Palette (Cmd+K). No mouse required.",
    icon: Terminal,
    content: () => <DeveloperUxBlock />
  },
  {
    id: "devops",
    title: "DevOps Integrations",
    description: "Connect GitHub/GitLab. See CI/CD statuses instantly on your tickets.",
    icon: GitPullRequest,
    content: () => <DevOpsIntegrationsBlock />
  },
  {
    id: "planning",
    title: "Planning & Knowledge",
    description: "Release management and rich-text wikis linked directly to your work.",
    icon: BookOpen,
    content: () => <PlanningKnowledgeBlock />
  }
];

export const CoreFeaturesSection = () => {
  return (
    <section className="py-24 md:py-32 relative max-w-[1280px] mx-auto px-6">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#ff1f1f]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto space-y-4">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f1f]/10 border border-[#ff1f1f]/20 text-[#ff1f1f] text-xs font-bold tracking-wider uppercase mb-2"
        >
          <Target className="w-3.5 h-3.5" />
          Product Tour
        </motion.div>
        <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ delay: 0.1 }}
           className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
        >
          Built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">modern builder</span>
        </motion.h2>
        <motion.p 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ delay: 0.2 }}
           className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mx-auto mt-4"
        >
          Everything you need to ship faster, without the bloated interface. 
          WurkFlo gives your team the power to plan, track, and execute flawlessly.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Row 1: Agile Management (col-span-3), Issue & Bug Tracking (col-span-3) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="lg:col-span-3 flex flex-col gap-5"
        >
          <div className="px-2">
            <div className="flex items-center gap-3 mb-2 text-xl font-bold text-white">
              <span className="p-2 rounded-lg bg-white/5 border border-white/10">
                {React.createElement(features[0].icon, { className: "w-5 h-5 text-white/80" })}
              </span>
              {features[0].title}
            </div>
            <p className="text-emerald-50/50 text-sm leading-relaxed mb-4">{features[0].description}</p>
          </div>
          <div className="flex-1 min-h-[320px]">
            {features[0].content()}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 flex flex-col gap-5"
        >
          <div className="px-2">
             <div className="flex items-center gap-3 mb-2 text-xl font-bold text-white">
              <span className="p-2 rounded-lg bg-white/5 border border-white/10">
                {React.createElement(features[1].icon, { className: "w-5 h-5 text-white/80" })}
              </span>
              {features[1].title}
            </div>
            <p className="text-emerald-50/50 text-sm leading-relaxed mb-4">{features[1].description}</p>
          </div>
          <div className="flex-1 min-h-[320px]">
             {features[1].content()}
          </div>
        </motion.div>

        {/* Row 2: Dev-Centric (span-2), DevOps (span-2), Planning (span-2) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-5 mt-4"
        >
          <div className="px-2">
             <div className="flex items-center gap-3 mb-2 text-xl font-bold text-white">
              <span className="p-2 rounded-lg bg-white/5 border border-white/10">
                {React.createElement(features[2].icon, { className: "w-5 h-5 text-white/80" })}
              </span>
              {features[2].title}
            </div>
            <p className="text-emerald-50/50 text-sm leading-relaxed mb-4">{features[2].description}</p>
          </div>
          <div className="flex-1 min-h-[280px]">
             {features[2].content()}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 flex flex-col gap-5 mt-4"
        >
          <div className="px-2">
             <div className="flex items-center gap-3 mb-2 text-xl font-bold text-white">
              <span className="p-2 rounded-lg bg-white/5 border border-white/10">
                {React.createElement(features[3].icon, { className: "w-5 h-5 text-white/80" })}
              </span>
              {features[3].title}
            </div>
            <p className="text-emerald-50/50 text-sm leading-relaxed mb-4">{features[3].description}</p>
          </div>
          <div className="flex-1 min-h-[280px]">
             {features[3].content()}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 flex flex-col gap-5 mt-4"
        >
          <div className="px-2">
             <div className="flex items-center gap-3 mb-2 text-xl font-bold text-white">
              <span className="p-2 rounded-lg bg-white/5 border border-white/10">
                {React.createElement(features[4].icon, { className: "w-5 h-5 text-white/80" })}
              </span>
              {features[4].title}
            </div>
            <p className="text-emerald-50/50 text-sm leading-relaxed mb-4">{features[4].description}</p>
          </div>
          <div className="flex-1 min-h-[280px]">
             {features[4].content()}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
