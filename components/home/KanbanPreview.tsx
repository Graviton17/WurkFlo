'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Card = {
  id: string;
  title: string;
  tag: string;
  column: 'todo' | 'in-progress' | 'done';
  priority?: 'high' | 'medium' | 'low';
};

const INITIAL_CARDS: Card[] = [
  { id: 'c1', title: 'Design Database Schema', tag: 'Backend', column: 'todo', priority: 'high' },
  { id: 'c2', title: 'Setup CI/CD Pipeline', tag: 'DevOps', column: 'in-progress', priority: 'medium' },
  { id: 'c3', title: 'Implement Auth Flow', tag: 'Security', column: 'in-progress', priority: 'high' },
  { id: 'c4', title: 'Hero Section UI', tag: 'Frontend', column: 'done', priority: 'low' },
];

export const KanbanPreview = () => {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const moveCandidates = newCards.filter(c => c.column !== 'done');
        if (moveCandidates.length === 0) {
          return INITIAL_CARDS;
        }

        // Prefer moving cards that are further to the left, but keep it random
        const cardToMove = moveCandidates[Math.floor(Math.random() * moveCandidates.length)];
        const cardIndex = newCards.findIndex(c => c.id === cardToMove.id);

        if (cardToMove.column === 'todo') {
          newCards[cardIndex] = { ...cardToMove, column: 'in-progress' };
        } else if (cardToMove.column === 'in-progress') {
          newCards[cardIndex] = { ...cardToMove, column: 'done' };
        }

        return newCards;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'text-neutral-400', accent: 'bg-neutral-500/20' },
    { id: 'in-progress', title: 'In Progress', color: 'text-blue-400', accent: 'bg-blue-500/20' },
    { id: 'done', title: 'Done', color: 'text-green-400', accent: 'bg-green-500/20' },
  ];

  return (
    <div className="w-full h-full min-h-[480px] p-4 lg:p-6 rounded-[2rem] bg-[#0a0a0a]/80 border border-white/10 backdrop-blur-2xl shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Header mock */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600/50" />
          <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600/50" />
        </div>
        <div className="h-6 px-3 flex items-center bg-white/5 rounded-full border border-white/5">
          <span className="text-[10px] text-white/50 font-medium">Sprint 42</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 lg:gap-4 h-full">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col h-full bg-white/[0.02] rounded-2xl p-3 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

            <div className="flex items-center justify-between px-1 mb-4">
              <span className={`text-xs font-semibold ${col.color}`}>{col.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${col.accent} ${col.color}`}>
                {cards.filter(c => c.column === col.id).length}
              </span>
            </div>

            <div className="flex-1 space-y-3 relative z-10">
              <AnimatePresence>
                {cards.filter(c => c.column === col.id).map(card => (
                  <motion.div
                    key={card.id}
                    layout
                    layoutId={card.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="p-3.5 rounded-xl bg-[#141414] border border-white/5 shadow-xl cursor-grab active:cursor-grabbing hover:border-white/10 hover:bg-[#0d0d0f] transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex space-x-1">
                        <div className={`h-1.5 w-6 rounded-full ${card.priority === 'high' ? 'bg-red-500/50' : card.priority === 'medium' ? 'bg-yellow-500/50' : 'bg-green-500/50'}`} />
                        <div className="h-1.5 w-4 rounded-full bg-white/10" />
                      </div>
                      {/* Avatar mock */}
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border border-white/10 shadow-inner group-hover:scale-110 transition-transform" />
                    </div>

                    <p className="text-[13px] font-medium text-white/90 leading-snug mb-3">
                      {card.title}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-[9px] px-2 py-1 rounded bg-white/5 text-white/50 font-medium tracking-wider uppercase border border-white/5">
                        {card.tag}
                      </span>
                      {col.id === 'done' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center border border-green-500/20"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
