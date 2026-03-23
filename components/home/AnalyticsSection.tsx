'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, BarChart, Bar } from 'recharts';
import { Activity, Clock, Zap, TrendingUp, TrendingDown, Target } from 'lucide-react';

const leadTimeData = [
  { day: 'Mon', time: 4.2 },
  { day: 'Tue', time: 3.8 },
  { day: 'Wed', time: 4.5 },
  { day: 'Thu', time: 3.2 },
  { day: 'Fri', time: 2.8 },
  { day: 'Sat', time: 2.5 },
  { day: 'Sun', time: 2.2 },
];

const cycleTimeData = [
  { sprint: 'Sprint 1', time: 5.2 },
  { sprint: 'Sprint 2', time: 4.8 },
  { sprint: 'Sprint 3', time: 4.1 },
  { sprint: 'Sprint 4', time: 3.5 },
  { sprint: 'Sprint 5', time: 3.2 },
];

const burndownData = [
  { day: 'Day 1', ideal: 100, actual: 100 },
  { day: 'Day 3', ideal: 80, actual: 85 },
  { day: 'Day 5', ideal: 60, actual: 55 },
  { day: 'Day 7', ideal: 40, actual: 45 },
  { day: 'Day 10', ideal: 20, actual: 25 },
  { day: 'Day 14', ideal: 0, actual: 5 },
];

export const AnalyticsSection = () => {
  return (
    <section className="py-32 w-full border-y border-white/5 bg-[#0c0c0d] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
            <Activity className="w-4 h-4" />
            <span>Engineering Analytics</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Measure flow, <span className="text-white/50">not just output</span>
          </h2>
          <p className="text-lg text-white/60">
            Gain executive-level visibility into your engineering pipeline. Spot bottlenecks instantly, optimize cycle times, and ensure predictable sprint delivery with our story-driven dashboards.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Time Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 text-white/60 mb-1">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium uppercase tracking-wider">Lead Time</span>
                </div>
                <h3 className="text-2xl font-semibold text-white">2.2 <span className="text-sm text-white/50 font-normal">days avg</span></h3>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-md">
                <TrendingDown className="w-3 h-3" />
                24%
              </div>
            </div>
            <div className="h-[200px] w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={leadTimeData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeadTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="time" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLeadTime)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Cycle Time Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 text-white/60 mb-1">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium uppercase tracking-wider">Cycle Time</span>
                </div>
                <h3 className="text-2xl font-semibold text-white">3.2 <span className="text-sm text-white/50 font-normal">days avg</span></h3>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-md">
                <TrendingDown className="w-3 h-3" />
                15%
              </div>
            </div>
            <div className="h-[200px] w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cycleTimeData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="time" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Sprint Burndown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group lg:col-span-1"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 text-white/60 mb-1">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium uppercase tracking-wider">Sprint Burndown</span>
                </div>
                <h3 className="text-2xl font-semibold text-white">On Track <span className="text-sm text-white/50 font-normal">Sprint 42</span></h3>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" />
                98%
              </div>
            </div>
            <div className="h-[200px] w-full mt-auto relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burndownData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="ideal" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#18181b', stroke: '#a855f7', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
